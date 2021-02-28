import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    editProject,
    createProject,
    fetchOwnerProject,
    fetchOwnerProjects
} from "../../../src/services";

import { ProjectsModelInterface } from "../../../src/types";
import { projectCollection, taskCollection, userCollection } from "../db";

describe.only("Project Service: ", function () {
    beforeEach(async function () {
        await userCollection.populate();
        await projectCollection.populate();
        await taskCollection.populate();
    });
    afterEach(async function () {
        await userCollection.reset();
        await projectCollection.reset();
        await taskCollection.reset();
    });
    describe("Edit Project", function () {
        it("should be able to edit a single property", async function () {
            const project = await editProject({
                description: "Latest courses on udemy"
            }, {
                ownerId: "5f0f5bb7786b1c0e246357a4",
                projectId: "5f0f5c11786b1c0e246357a5"
            }) as ProjectsModelInterface
            expect(project.description).to.equal("Latest courses on udemy");
        });

        it("should be able to edit a multiple properties", async function () {
            const project = await editProject({
                description: "Latest courses on udemy",
                isFavourite: false
            }, {
                ownerId: "5f0f5bb7786b1c0e246357a4",
                projectId: "5f0f5c11786b1c0e246357a5"
            }) as ProjectsModelInterface
            expect(project.description).to.equal("Latest courses on udemy");
            expect(project.isFavourite).to.equal(false);
        });
    });

    describe("Create Project", function () {
        it("should be able to create a project", async function () {
            const project = await createProject({
                title: "test project",
                description: "Useful for test",
                isFavourite: false,
                owner: "5f0f5bb7786b1c0e246357a4"
            }) as ProjectsModelInterface;

            expect(project.description).to.equal("Useful for test");
            expect(project.title).to.equal("test project");
        });
    });

    describe("Fetch Project", function () {
        it("should fetch all the tasks for a project", async function () {
            const project = await fetchOwnerProject("5f0f5bb7786b1c0e246357a4", "5f0f5c11786b1c0e246357a5") as ProjectsModelInterface;
            expect(project.title).to.equal("JavaScript Lessons: Learn about promises");
            expect(typeof project.owner).to.equal("object");
        });

        it("should fetch all the projects for a user", async function () {
            const project = await fetchOwnerProjects("5f0f5bb7786b1c0e246357a4") as ProjectsModelInterface[];
            expect(project.length).to.equal(1);
            expect(project[0].title).to.equal("JavaScript Lessons: Learn about promises");
        });
    });
});
