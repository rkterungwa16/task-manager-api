import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import { findUserByEmail } from "../../src/services/api/user";
import { UsersModelInterface } from "../../src/types";
import { populate, reset } from "../db";

describe("User Service: ", function () {
    describe("Find User By Email", function () {
        beforeEach(async function() {
            await populate();
        });
        afterEach(async function() {
            await reset();
        })

        it("should return a registered user", async function () {
            const registeredUser = await findUserByEmail("kombol@kombol.com") as UsersModelInterface;
            expect(registeredUser.name).to.equal("terungwa kombol");
        });

        it("should return false for a user not registered", async function () {
            const registeredUser = await findUserByEmail("terungwa@kombol.com");
            expect(registeredUser).to.equal(false);
        });
    });
});
