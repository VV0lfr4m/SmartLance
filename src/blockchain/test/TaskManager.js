const {expect} = require("chai");
const {ethers, network} = require("hardhat");


describe("TaskManager", () => {

    let owner;
    let executor;
    let atbiter;
    let smartContract;
    const ZERO_ADDRESS = ethers.constants.AddressZero;//"0x0000000000000000000000000000000000000000000000000000000000000000";

    beforeEach(async () => {
        [owner, executor, arbiter] = await ethers.getSigners();
        smartContract = await ethers.deployContract("TaskManager");

        console.log("TaskManager Contract successful deployed with address: ", smartContract.address);
    })

    describe("createTask", () => {
        it("Should create a task and emit event", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            let tx = await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            let task = await smartContract.getTask(1);

            expect(task.description).to.eq(descr);
            expect(task.budget).to.eq(budget);
            expect(task.endDate).to.eq(endDate);
            expect(task.owner).to.eq(owner.address);
            expect(task.executor).to.eq(ZERO_ADDRESS);
            expect(task.isCompleted).to.be.false;

            expect(tx).to
                .emit(smartContract, "TaskCreated")
                .withArgs(1, owner.address, descr, budget, endDate)
        })

        it("Should revert with TaskManager.createTask: Insufficient funds sent!", async () => {
            let descr = "werw";
            let budget = ethers.utils.parseEther("1");
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await expect(smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("0.5") })).to.be
                .revertedWith("TaskManager.createTask: Insufficient funds sent!");
        })
        it("Should revert with TaskManager.createTask: description should not be empty!", async () => {
            let descr = "";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await expect(smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") })).to.be
                .revertedWith("TaskManager.createTask: description should not be empty!");
        })
        it("TaskManager.createTask: budget should be greater then 0!", async () => {
            let descr = "tt";
            let budget = 0;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await expect(smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") })).to.be
                .revertedWith("TaskManager.createTask: budget should be greater then 0!");
        })
        it("Should revert with TaskManager.createTask: endDate must be in the future!", async () => {
            let descr = "tt";
            let budget = 120000;
            let endDate = 1436784089;//time in past

            await expect(smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") })).to.be
                .revertedWith("TaskManager.createTask: endDate must be in the future!");
        })
    })

    describe("assignExecutor", () => {
        it("Should assign an executor and emit event", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            let taskId = 1;
            let _executor = executor.address;
            let tx = await smartContract.assignExecutor(taskId, _executor);

            let task = await smartContract.getTask(1);

            expect(task.executor).to.eq(_executor);

            expect(tx).to
                .emit(smartContract, "TaskAssigned")
                .withArgs(1, _executor)
        })

        it("Should revert with TaskManager.assignExecutor: TaskManager.existingTask: Task does not exist", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;
            let taskId = 0;
            let _executor = executor.address;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            await expect(smartContract.connect(executor).assignExecutor(taskId, _executor)).to.be
                .revertedWith("TaskManager.existingTask: Task does not exist");
        })

        it("Should revert with TaskManager.assignExecutor: Only owner can perform this operation!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;
            let taskId = 1;
            let _executor = executor.address;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            await expect(smartContract.connect(executor).assignExecutor(taskId, _executor)).to.be
                .revertedWith("TaskManager.assignExecutor: Only owner can perform this operation!");
        })

        it("Should revert with TaskManager.assignExecutor: Invalid executor address!", async () => {
            let descr = "tt";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;
            let taskId = 1;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            await expect(smartContract.assignExecutor(taskId, ZERO_ADDRESS)).to.be
                .revertedWith("TaskManager.assignExecutor: Invalid executor address!");
        })

        it("Should revert with TaskManager.assignExecutor: Executor already assigned!", async () => {
            let descr = "tt";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;
            let taskId = 1;
            let _executor = executor.address;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });
            await smartContract.assignExecutor(taskId, _executor);

            await expect(smartContract.assignExecutor(taskId, _executor)).to.be
                .revertedWith("TaskManager.assignExecutor: Executor already assigned!");
        })
    })

    describe("completeTask", () => {
        it("Should complete a task and emit event", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            let tx = await smartContract.connect(executor).completeTask(1);

            let task = await smartContract.getTask(1);

            expect(task.isCompleted).to.be.true;

            expect(tx).to
                .emit(smartContract, "TaskCompleted")
                .withArgs(1)
        })

        it("Should revert with TaskManager.completeTask: Only executor can complete the task!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            await expect(smartContract.connect(owner).completeTask(1)).to.be
                .revertedWith("TaskManager.completeTask: Only executor can complete the task!");
        })

        it("Should revert with TaskManager.completeTask: Task already completed!", async () => {
            let descr = "test descr";
            let budget = 120000;
            let endDate = Math.floor(Date.now() / 1000) * 360000;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

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
            let endDate = Math.floor(Date.now() / 1000) + 160000;

            await smartContract.createTask( descr, budget, endDate, { value: ethers.utils.parseEther("1") });

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
        let endDate;
        beforeEach(async () => {
            const description = "Test Task";
            const budget = ethers.utils.parseEther("1");
            endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask(description, budget, endDate, { value: ethers.utils.parseEther("1") });
        });

        it("should return the correct task details", async () => {
            const task = await smartContract.getTask(1);

            expect(task.owner).to.equal(owner.address);
            expect(task.description).to.equal("Test Task");
            expect(task.budget).to.equal(ethers.utils.parseEther("1"));
            expect(task.endDate).to.be.eq(endDate);  // Now comparing in seconds
            expect(task.executor).to.equal(ZERO_ADDRESS);
            expect(task.isCompleted).to.be.false;
        });
    });

    describe("getAllTasks", () => {
        beforeEach(async () => {
            const budget = ethers.utils.parseEther("1");
            const endDate = Math.floor(Date.now() / 1000) * 360000;

            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: ethers.utils.parseEther("1") });
            await smartContract.connect(owner).createTask("Task 2", budget, endDate, { value: ethers.utils.parseEther("1") });
        });

        it("should return all tasks", async () => {
            const tasks = await smartContract.getAllTasks();

            expect(tasks.length).to.equal(2);

            expect(tasks[0].description).to.equal("Task 1");
            expect(tasks[1].description).to.equal("Task 2");
        });
    });

    describe("acceptTask", () => {
        beforeEach(async () => {
            const budget = ethers.utils.parseEther("1");
            const endDate = Math.floor(Date.now() / 1000) * 360000;

            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: ethers.utils.parseEther("1") });
        });

        it("should accepts task and emit event", async () => {
            const tx = await smartContract.connect(executor).acceptTask(1);
            const task = await smartContract.getTask(1);

            expect(task.executor).to.equal(executor.address);

            expect(tx).to
                .emit(smartContract, "TaskAssigned")
                .withArgs(1, executor.address)
        });

        it("Should revert with TaskManager.acceptTask: Task already accepted", async () => {
            await smartContract.connect(executor).acceptTask(1);
            await expect(smartContract.connect(executor).acceptTask(1)).to.be
                .revertedWith("TaskManager.acceptTask: Task already accepted");
        })
        it("Should revert with TaskManager.acceptTask: Task owner cannot accept their own task", async () => {
            await expect(smartContract.connect(owner).acceptTask(1)).to.be
                .revertedWith("TaskManager.acceptTask: Task owner cannot accept their own task");
        })
    });

    describe("getContractBalance", () => {
        it("should return the correct contract balance", async () => {
            // Check initial contract balance
            const initialBalance = await ethers.provider.getBalance(smartContract.address);

            // Deposit some Ether into the contract
            const depositAmount = ethers.utils.parseEther("1"); // 1 Ether
            const budget = ethers.utils.parseEther("1");
            const endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: ethers.utils.parseEther("1") });


            // Get the contract's balance using the `getContractBalance` function
            const contractBalance = await smartContract.getContractBalance();

            // Assert that the contract balance is correct
            expect(contractBalance).to.equal(initialBalance.add(depositAmount));
        });
    });

    describe("confirmTaskCompletion", () => {
        it("should set confirmed true and send money to executor and emit even", async () => {

            const budget = 1000;
            const endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: budget });

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);
            await smartContract.connect(executor).completeTask(1);

            const tx = await smartContract.connect(owner).confirmTaskCompletion(1, {value: budget});
            await expect(tx).to.changeEtherBalance(_executor, budget);

            let task = await smartContract.getTask(1);

            expect(task.isConfirmed).to.be.true;
            expect(tx).to
                .emit(smartContract, "TaskConfirmed")
                .withArgs(1, owner.address)
        });
        it("Should revert with TaskManager.confirmTaskCompletion: You are not an owner", async () => {
            const budget = 1000;
            const endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: budget });

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);
            await smartContract.connect(executor).completeTask(1);

            expect(smartContract.connect(executor).confirmTaskCompletion(1, {value: budget})).to.be
                .revertedWith("TaskManager.confirmTaskCompletion: You are not an owner");
        })

        it("Should revert with TaskManager.confirmTaskCompletion: Task is not completed", async () => {
            const budget = 1000;
            const endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: budget });

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);

            expect(smartContract.connect(owner).confirmTaskCompletion(1, {value: budget})).to.be
                .revertedWith("TaskManager.confirmTaskCompletion: Task is not completed");
        })

        it("Should revert with TaskManager: Task is under arbitration", async () => {
            const budget = 1000;
            const endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: budget });

            let taskId = 1;
            let _executor = executor.address;
            await smartContract.assignExecutor(taskId, _executor);
            await smartContract.connect(executor).completeTask(1);

            await smartContract.connect(owner).initiateArbitration(taskId, arbiter.address);

            expect(smartContract.connect(owner).confirmTaskCompletion(1, {value: budget})).to.be
                .revertedWith("TaskManager: Task is under arbitration");
        })
    });


    describe("completeArbitration", () => {
        let taskId;
        let budget;
        let endDate;

        beforeEach(async () => {
            budget = BigInt(ethers.utils.parseEther("1")); // 1 Ether
            endDate = Math.floor(Date.now() / 1000) * 360000;
            await smartContract.connect(owner).createTask("Task 1", budget, endDate, { value: budget });

            taskId = 1;
            await smartContract.assignExecutor(taskId, executor.address);
            await smartContract.connect(executor).completeTask(taskId);

            // Initiating arbitration
            await smartContract.connect(owner).initiateArbitration(taskId, arbiter.address);
        });

        it("Should revert if arbitrationManager is reset and task is not in arbitration", async () => {
            const taskId = 1;
            await smartContract.connect(arbiter).completeArbitration(taskId); // Завершення арбітражу

            // Перевірка: завдання більше не в арбітражі
            let task = await smartContract.getTask(taskId);
            expect(task.isInArbitration).to.be.false;

            // Тепер перевіряємо, що другий виклик завершення арбітражу буде скинутий
            await expect(
                smartContract.connect(arbiter).completeArbitration(taskId)
            ).to.be.revertedWith("TaskManager: Task is not in arbitration");
        });


        it("Should complete arbitration successfully when conditions are met", async () => {
            // Ensure the task is in arbitration before completing it
            const taskBefore = await smartContract.getTask(taskId);
            expect(taskBefore.isInArbitration).to.be.true;

            // Complete the arbitration
            const tx = await smartContract.connect(arbiter).completeArbitration(taskId);
            await tx.wait(); // Ensure the transaction is mined

            // Ensure that the task is no longer in arbitration and arbiter is reset
            const taskAfter = await smartContract.getTask(taskId);
            expect(taskAfter.isInArbitration).to.be.false;

            // Check if the event was emitted
            expect(tx)
                .to.emit(smartContract, "ArbitrationCompleted")
                .withArgs(taskId, arbiter.address);
        });
    });
})