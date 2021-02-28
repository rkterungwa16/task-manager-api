import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    editProject
} from "../../../src/services";

import { ProjectsModelInterface } from "../../../src/types";
import { projectCollection } from "../db";

describe.only("Project Service: ", function () {
    beforeEach(async function () {
        await projectCollection.populate();
    });
    afterEach(async function () {
        await projectCollection.reset();
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
});
