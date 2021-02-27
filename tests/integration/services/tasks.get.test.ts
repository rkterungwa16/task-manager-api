import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ObjectID } from "mongodb";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    createTask,
    fetchProjectTasks,
    fetchTodaysTasks,
    fetchUsersOverDueTasks,
    editTask
} from "../../../src/services";

import { TasksModelInterface } from "../../../src/types";
import { taskCollection, projectCollection } from "../db";

describe.only("Task Service: ", function () {
    beforeEach(async function () {
        await taskCollection.populate();
        await projectCollection.populate();
    });
    afterEach(async function () {
        await taskCollection.reset();
        await projectCollection.reset();
    });
    describe("Fetch Tasks", function () {
        it("should fetch all the tasks for a project", async function () {
            const projectTasks = await fetchProjectTasks("5f0f5c11786b1c0e246357a5") as TasksModelInterface[];
            expect(projectTasks.length).to.equal(1);
            expect(projectTasks[0].priority).to.equal(1);
            expect(typeof projectTasks[0].project).to.equal("object");
        });

        it("should fetch a users task for today", async function () {
            const todaysTasks = await fetchTodaysTasks(new ObjectID("5f0f5bb7786b1c0e246357a4")) as TasksModelInterface[];
            expect(todaysTasks.length).to.equal(0);
        });

        it("should fetch a users tasks that are overdue", async function () {
            const overDueTasks = await fetchUsersOverDueTasks(new ObjectID("5f0f5bb7786b1c0e246357a4")) as TasksModelInterface[];
            expect(overDueTasks.length).to.equal(1);
            expect(overDueTasks[0].priority).to.equal(1);
        });
    });
});
