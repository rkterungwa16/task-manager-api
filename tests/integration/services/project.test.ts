import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    editProject,
    createProject,
    fetchOwnerProject,
    fetchOwnerProjects,
    addCollaborators
} from "../../../src/services";

import { ProjectsModelInterface } from "../../../src/types";
import { projectCollection, taskCollection, userCollection } from "../db";

describe("Project Service: ", function () {
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
    describe("Add collabortors", function () {
        it("should throw an error if a project does not exist", async function () {
            try {
                await addCollaborators({
                    collaboratorsEmails: ["kombol@gmail.com"],
                }, "5f0f5bb7786b1c0e246357a4", "5f0f5bb7786b1c0e246357a4");
            } catch (e) {
                expect(e.message).to.equal("Project does not exist");
            }
        })

        it("should throw an error if a collaborator is an owner", async function () {
            try {
                await addCollaborators({
                    collaboratorsEmails: ["kombol@kombol.com"],
                }, "5f0f5c11786b1c0e246357a5", "5f0f5bb7786b1c0e246357a4");
            } catch (e) {
                expect(e.message).to.equal("Owner cannot be a collaborator");
            }
        });

        it("should add all collaborators to database even if they don't exist already", async function () {
            const projectCollaborators = await addCollaborators({
                collaboratorsEmails: ["terungwakombol@gmail.com"],
            }, "5f0f5c11786b1c0e246357a5", "5f0f5bb7786b1c0e246357a4");
            expect(projectCollaborators.invites instanceof Array).to.equal(true);
            expect(projectCollaborators.invites[0].owner.email).to.equal("kombol@kombol.com");
            expect(projectCollaborators.invites[0].collaborator.email).to.equal("terungwakombol@gmail.com");
        })

        it("should add all collaborators even if some are already registered", async function () {
            const projectCollaborators = await addCollaborators({
                collaboratorsEmails: ["terungwakombol@gmail.com", "rkterungwa@gmail.com"],
            }, "5f0f5c11786b1c0e246357a5", "5f0f5bb7786b1c0e246357a4");

            expect(projectCollaborators.invites instanceof Array).to.equal(true);
            expect(projectCollaborators.invites[0].collaborator.email).to.equal("terungwakombol@gmail.com");
            expect(projectCollaborators.invites[1].collaborator.email).to.equal("rkterungwa@gmail.com");
        })

        it("should add all collaborators even if all of them are already registered", async function () {
            const projectCollaborators = await addCollaborators({
                collaboratorsEmails: ["rkterungwa@gmail.com"],
            }, "5f0f5c11786b1c0e246357a5", "5f0f5bb7786b1c0e246357a4");
            expect(projectCollaborators.invites instanceof Array).to.equal(true);
            expect(projectCollaborators.invites[0].collaborator.email).to.equal("rkterungwa@gmail.com");
        })

        it("should throw an error if user is already a collaborator on the project", async function () {
            try {
                await addCollaborators({
                    collaboratorsEmails: ["rkterungwa@gmail.com"],
                }, "5f0f5c11786b1c0e246357a5", "5f0f5bb7786b1c0e246357a4");

                await addCollaborators({
                    collaboratorsEmails: ["rkterungwa@gmail.com"],
                }, "5f0f5c11786b1c0e246357a5", "5f0f5bb7786b1c0e246357a4");

            } catch(e) {
                expect(e.message).to.equal("rkterungwa@gmail.com already a collaborator");
            }
        })
    })
});
