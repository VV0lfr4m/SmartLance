const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");


describe("ArbitrationManager", () => {

    let owner;
    let executor;
    let arbiter;
    let arbManager;
    let taskManager;

    beforeEach(async () => {
        [owner, executor, arbiter] = await ethers.getSigners();
        const deployFactory = await ethers.deployContract("DeployFactory");
        await deployFactory.deployContracts();

        let taskManagerAdd =  await deployFactory.taskManager();
        let arbManagerAdd = await deployFactory.arbitrationManager();

        expect(taskManagerAdd).to.not.equal(ethers.constants.AddressZero);
        expect(arbManagerAdd).to.not.equal(ethers.constants.AddressZero);

        // Перевіряємо, чи TaskManager знає адресу ArbitrationManager
        taskManager = await ethers.getContractAt("TaskManager", taskManagerAdd);
        expect(await taskManager.arbitrationManagerAddress()).to.equal(arbManagerAdd);

        // Перевіряємо, чи ArbitrationManager знає адресу TaskManager
        arbManager = await ethers.getContractAt("ArbitrationManager", arbManagerAdd);
        expect(await arbManager.taskManagerAddress()).to.equal(taskManagerAdd);

        console.log("------->------->------->------->-------> ")
        console.log("------->------->------->------->-------> ")
        console.log("------->------->------->------->-------> ")
        console.log("------->------->------->------->-------> ")
        //expect(await taskManager.contractOwner).to.equal(owner.address);
        //expect(await arbManager.contractOwner).to.equal(owner.address);
        console.log("taskManager.contractOwner() -------> ", await taskManager.contractOwner())
        console.log("arbManager.contractOwner() -------> " ,await arbManager.contractOwner())
    })

    describe("initializeArbitration", () => {
        it("Should create and get arbitration, transfer funds to ArbitrationManager, emit events, and update task state", async () => {
            let _taskId = 1;
            let _budget = 1000; // Бюджет у Wei
            let _description = "Test Task";
            let _endDate = Math.floor(Date.now() / 1000) * 360000

            // Створення задачі
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            // Перевірка початкового стану
            let task = await taskManager.getTask(_taskId);
            expect(task.isInArbitration).to.be.false; // Завдання ще не в арбітражі

            // Баланс ArbitrationManager до виклику
            const arbitrationBalanceBefore = await ethers.provider.getBalance(arbManager.address);

            // Виклик initiateArbitration
            expect(await taskManager.initiateArbitration(_taskId, arbiter.address))
                .to.emit(taskManager, "ArbitrationInitiated") // Подія в TaskManager
                .withArgs(_taskId, arbiter.address)
                .and.to.emit(arbManager, "ArbitrationInitiated") // Подія в ArbitrationManager
                .withArgs(1, _taskId, arbiter.address) // arbCount = 1 для першого арбітражу
                .and.to.emit(arbManager, "Received") // Подія отримання ETH
                .withArgs(taskManager.address, _budget);

            // Перевірка балансу ArbitrationManager після виклику
            const arbitrationBalanceAfter = await ethers.provider.getBalance(arbManager.address);
            expect(arbitrationBalanceAfter.sub(arbitrationBalanceBefore)).to.equal(_budget); // Бюджет переданий

            // Перевірка зміни стану завдання
            task = await taskManager.getTask(_taskId);
            expect(task.isInArbitration).to.be.true; // Завдання має бути в арбітражі

            // Перевірка даних у ArbitrationManager
            const arbitration = await arbManager.getArbitration(_taskId);
            expect(arbitration.taskId).to.equal(_taskId);
            expect(arbitration.owner).to.equal(owner.address);
            expect(arbitration.executor).to.equal(executor.address);
            expect(arbitration.arbiter).to.equal(arbiter.address);
            expect(arbitration.budget).to.equal(_budget);
            expect(arbitration.resolved).to.be.false; // Арбітраж ще не вирішено
            expect(arbitration.winner).to.equal(ethers.constants.AddressZero); // Ще немає переможця
        });
        it("Should revert with TaskManager.onlyTaskManager: Only TaskManager can call this function", async () => {
            let _taskId = 1;
            let _budget = 1000;
            let tx = arbManager.connect(owner).initializeArbitration(_taskId, owner.address, executor.address, _budget, arbiter.address);

            await expect(tx).to.be.revertedWith("TaskManager.onlyTaskManager: Only TaskManager can call this function");
        })
        it("Should revert with TaskManager.initiateArbitration: Invalid arbiter address", async () => {
            let _taskId = 1;
            let _budget = 1000; // Бюджет у Wei
            let _description = "Test Task";
            let _endDate = Math.floor(Date.now() / 1000) * 360000

            // Створення задачі
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            await expect(taskManager.initiateArbitration(_taskId, ethers.constants.AddressZero))
                .to.be.revertedWith("TaskManager.initiateArbitration: Invalid arbiter address");
        })
    });

    describe("resolveArbitration", () => {
        it("Should resolve arbitration, transfer funds to winner, and emit event", async () => {
            const _taskId = 1;
            const _budget = 1000;
            const _description = "Test Task";
            const _endDate = Math.floor(Date.now() / 1000) * 360000;

            // Створення задачі
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            // Ініціалізація арбітражу
            await taskManager.initiateArbitration(_taskId, arbiter.address);

            let tx = arbManager.connect(arbiter).resolveArbitration(_taskId, executor.address);
            // Резолюція арбітражу
            expect(await tx).to.changeEtherBalances(
                [arbManager, executor],
                [-_budget, _budget]);

            // Перевірка події
            expect(await tx)
                .to.emit(arbManager, "ArbitrationResolved")
                .withArgs(_taskId, executor.address, _budget);

            // Перевірка стану арбітражу
            const arbitration = await arbManager.getArbitration(_taskId);
            expect(arbitration.resolved).to.be.true; // Арбітраж вирішено
            expect(arbitration.winner).to.equal(executor.address); // Виконавець переміг
        });

        it("Should revert if non-arbiter tries to resolve arbitration", async () => {
            const _taskId = 1;
            const _budget = 1000;
            const _description = "Test Task";
            const _endDate = Math.floor(Date.now() / 1000) * 360000;

            // Створення задачі
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            // Ініціалізація арбітражу
            await taskManager.initiateArbitration(_taskId, arbiter.address);

            // Спроба резолюції арбітражу не від арбітра
            await expect(
                arbManager.connect(owner).resolveArbitration(_taskId, executor.address)
            ).to.be.revertedWith("ArbitrationManager.onlyArbiter: Only arbiter can proceed");
        });
    });

    describe("finalizeArbitration", () => {
        it("Should finalize resolved arbitration and emit event", async () => {
            const _taskId = 1;
            const _budget = 1000;
            const _description = "Test Task";
            const _endDate = Math.floor(Date.now() / 1000) * 360000;

            // Створення задачі
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            // Ініціалізація та резолюція арбітражу
            await taskManager.initiateArbitration(_taskId, arbiter.address);
            await arbManager.connect(arbiter).resolveArbitration(_taskId, executor.address);

            // Фіналізація арбітражу
            expect(await arbManager.connect(arbiter).finalizeArbitration(_taskId))
                .to.emit(arbManager, "ArbitrationFinalized")
                .withArgs(_taskId); // Перевіряємо подію

            // Перевірка, що арбітраж видалено
            await expect(arbManager.getArbitration(_taskId))
                .to.be.revertedWith("ArbitrationManager.getArbitration: Arbitration does not exist");
        });

        it("Should revert if arbitration is not resolved", async () => {
            const _taskId = 1;
            const _budget = 1000;
            const _description = "Test Task";
            const _endDate = Math.floor(Date.now() / 1000) * 360000;

            // Створення задачі
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            // Ініціалізація арбітражу
            await taskManager.initiateArbitration(_taskId, arbiter.address);

            // Спроба фіналізації нерозв'язаного арбітражу
            await expect(arbManager.connect(arbiter).finalizeArbitration(_taskId))
                .to.be.revertedWith("ArbitrationManager.finalizeArbitration: Arbitration not resolved yet");
        });
    });
    describe("setTaskManager", () => {
        it("Should set TaskManager address by owner", async () => {
            const newTaskManagerAddress = executor.address;

            // Connect arbManager to the owner account
            await expect(
                arbManager.connect(owner).setTaskManager(newTaskManagerAddress)
            ).to.not.be.reverted;

            // Verify the TaskManager address was updated
            expect(await arbManager.taskManagerAddress()).to.equal(newTaskManagerAddress);
        });

        it("Should revert if non-owner tries to set TaskManager address", async () => {
            const newTaskManagerAddress = executor.address;

            // Non-owner tries to set the TaskManager address
            await expect(
                arbManager.connect(executor).setTaskManager(newTaskManagerAddress)
            ).to.be.revertedWith("ArbitrationManager: Only owner can set TaskManager");
        });
    });
    describe("isInArbitration", () => {
        it("Should set TaskManager address by owner", async () => {
            const newTaskManagerAddress = executor.address;

            // Ensure the call is made from the owner account
            await expect(
                arbManager.connect(owner).setTaskManager(newTaskManagerAddress)
            ).to.not.be.reverted;

            // Verify the TaskManager address was updated
            expect(await arbManager.taskManagerAddress()).to.equal(newTaskManagerAddress);
        });

        it("Should return false if task is not in arbitration", async () => {
            const _taskId = 1;
            const _budget = 1000;
            const _description = "Test Task";
            const _endDate = Math.floor(Date.now() / 1000) * 360000;

            // Create task without initiating arbitration
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);

            // Verify task is not in arbitration
            expect(await arbManager.isInArbitration(_taskId)).to.be.false;
        });
    });

    describe("getBalance", () => {
        it("Should return the contract balance", async () => {
            const _taskId = 1;
            const _budget = 1000;
            const _description = "Test Task";
            const _endDate = Math.floor(Date.now() / 1000) * 360000;

            // Create task and initiate arbitration
            await taskManager.createTask(_description, _budget, _endDate, { value: _budget });
            await taskManager.assignExecutor(_taskId, executor.address);
            await taskManager.initiateArbitration(_taskId, arbiter.address);

            // Verify contract balance matches the task budget
            expect(await arbManager.getBalance()).to.equal(_budget);
        });
    });
});