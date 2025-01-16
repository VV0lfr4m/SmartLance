const {expect} = require("chai");
const {ethers, network} = require("hardhat");


describe("TaskManager", () => {

    let owner;
    let executor;
    let smartContract;
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    beforeEach(async () => {
        [owner, executor] = await ethers.getSigners();
        smartContract = await ethers.deployContract("TaskManager");

        console.log("TaskManager Contract successful deployed with address: ", smartContract.address);
    })

    describe("createTask", () => {
        it("Should create a task and emit event", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1736784089;

            let tx = await smartContract.createTask(descr, budget, endDate);

            let task = await smartContract.getTask(1);

            expect(task.description).to.eq(descr);
            expect(task.budget).to.eq(budget);
            expect(task.endDate).to.eq(endDate);
            expect(task.owner).to.eq(owner.address);
            expect(task.executor).to.eq(ZERO_ADDRESS);
            expect(task.isCompleted).to.be.false;

            await expect(tx).to
                .emit(smartContract, "TaskCreated")
                .withArgs(1, owner.address, descr, budget, endDate)
        })

        it("Should revert with TaskManager.createTask: description should not be empty!", async () => {
            let descr = "";
            let budget = 120000;
            let endDate = 1736784089;//time in future

            await expect(smartContract.createTask(descr, budget, endDate)).to.be
                .revertedWith("TaskManager.createTask: description should not be empty!");
        })
        it("TaskManager.createTask: budget should be greater then 0!", async () => {
            let descr = "tt";
            let budget = 0;
            let endDate = 1736784089;

            await expect(smartContract.createTask(descr, budget, endDate)).to.be
                .revertedWith("TaskManager.createTask: budget should be greater then 0!");
        })
        it("Should revert with TaskManager.createTask: endDate must be in the future!", async () => {
            let descr = "tt";
            let budget = 120000;
            let endDate = 1436784089;//time in past

            await expect(smartContract.createTask(descr, budget, endDate)).to.be
                .revertedWith("TaskManager.createTask: endDate must be in the future!");
        })
    })

    describe("assignExecutor", () => {
        it("Should assign an executor and emit event", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1736784089;

            await smartContract.createTask(descr, budget, endDate);

            let taskId = 1;
            let _executor = executor.address;
            let tx = await smartContract.assignExecutor(taskId, _executor);

            let task = await smartContract.getTask(1);

            expect(task.executor).to.eq(_executor);

            await expect(tx).to
                .emit(smartContract, "TaskAssigned")
                .withArgs(1, _executor)
        })

        it("Should revert with TaskManager.assignExecutor: Only owner can perform this operation!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1836784089;
            let taskId = 1;
            let _executor = executor.address;

            await smartContract.createTask(descr, budget, endDate);

            await expect(smartContract.connect(executor).assignExecutor(taskId, _executor)).to.be
                .revertedWith("TaskManager.assignExecutor: Only owner can perform this operation!");
        })

        it("Should revert with TaskManager.assignExecutor: Invalid executor address!", async () => {
            let descr = "tt";
            let budget = 120000;
            let endDate = 1836784089;
            let taskId = 1;

            await smartContract.createTask(descr, budget, endDate);

            await expect(smartContract.assignExecutor(taskId, ZERO_ADDRESS)).to.be
                .revertedWith("TaskManager.assignExecutor: Invalid executor address!");
        })

        it("Should revert with TaskManager.assignExecutor: Executor already assigned!", async () => {
            let descr = "tt";
            let budget = 120000;
            let endDate = 1836784089;
            let taskId = 1;
            let _executor = executor.address;

            await smartContract.createTask(descr, budget, endDate);
            await smartContract.assignExecutor(taskId, _executor);

            await expect(smartContract.assignExecutor(taskId, _executor)).to.be
                .revertedWith("TaskManager.assignExecutor: Executor already assigned!");
        })
    })

    describe("completeTask", () => {
        it("Should complete a task and emit event", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1836784089;

            await smartContract.createTask(descr, budget, endDate);

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            let tx = await smartContract.connect(executor).completeTask(1);

            let task = await smartContract.getTask(1);

            expect(task.isCompleted).to.be.true;

            await expect(tx).to
                .emit(smartContract, "TaskCompleted")
                .withArgs(1)
        })

        it("Should revert with TaskManager.completeTask: Only executor can complete the task!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1836784089;

            await smartContract.createTask(descr, budget, endDate);

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            await expect(smartContract.connect(owner).completeTask(1)).to.be
                .revertedWith("TaskManager.completeTask: Only executor can complete the task!");
        })

        it("Should revert with TaskManager.completeTask: Task already completed!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1836784089;

            await smartContract.createTask(descr, budget, endDate);

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            await smartContract.connect(executor).completeTask(1);

            await expect(smartContract.connect(executor).completeTask(1)).to.be
                .revertedWith("TaskManager.completeTask: Task already completed!");
        })

        it("Should revert with TaskManager.completeTask: Deadline has passed!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = 1736784089;

            await smartContract.createTask(descr, budget, endDate);

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            await ethers.provider.send("evm_increaseTime", [360000]); // Increase time by 1 hour
            await ethers.provider.send("evm_mine", []); // Mine a new block


            await expect(smartContract.connect(executor).completeTask(1)).to.be
                .revertedWith("TaskManager.completeTask: Deadline has passed!");
        })
    })

    describe("getTask", () => {
        beforeEach(async () => {
            const description = "Test Task";
            const budget = ethers.parseEther("1");
            const endDate = 2736784089;
            await smartContract.connect(owner).createTask(description, budget, endDate);
        });

        it("should return the correct task details", async () => {
            const endDate = 2736784089;
            const task = await smartContract.getTask(1);

            expect(task.owner).to.equal(owner.address);
            expect(task.description).to.equal("Test Task");
            expect(task.budget).to.equal(ethers.parseEther("1"));
            expect(task.endDate).to.be.eq(endDate);
            expect(task.executor).to.equal(ZERO_ADDRESS);
            expect(task.isCompleted).to.be.false;
        });
    });

    describe("getAllTasks", () => {
        beforeEach(async () => {
            const budget = ethers.parseEther("1");
            const endDate = 2736784089;

            await smartContract.connect(owner).createTask("Task 1", budget, endDate);
            await smartContract.connect(owner).createTask("Task 2", budget, endDate);
        });

        it("should return all tasks", async () => {
            const tasks = await smartContract.getAllTasks();

            expect(tasks.length).to.equal(2);

            expect(tasks[0].description).to.equal("Task 1");
            expect(tasks[1].description).to.equal("Task 2");
        });
    });
})