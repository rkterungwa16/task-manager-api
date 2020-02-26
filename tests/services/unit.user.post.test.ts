import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    authenticateUser,
    createUser,
    error,
    findUserByEmail
} from "../../src/services";
import { UsersModelInterface } from "../../src/types";
import { populate, reset } from "../db";

describe("User Service: ", function () {
    beforeEach(async function() {
        await populate();
    });
    afterEach(async function() {
        await reset();
    });
    describe("Find User By Email", function () {
        it("should return a registered user", async function () {
            const registeredUser = await findUserByEmail("kombol@kombol.com") as UsersModelInterface;
            expect(registeredUser.name).to.equal("terungwa kombol");
        });

        it("should return false for a user not registered", async function () {
            const registeredUser = await findUserByEmail("terungwa@kombol.com");
            expect(registeredUser).to.equal(false);
        });
    });

    describe("Register a new user", function () {
        it("should successfully create a new user", async function () {
            const registeredUser = await createUser({
                email: "john@doe.com",
                name: "John Doe",
                password: "123456"
            }) as UsersModelInterface;
            expect(registeredUser.name).to.equal("John Doe");
        });

        it("should throw an error for user that already exists", function () {
            function registeredUser() {
                throw createUser({
                    email: "kombol@kombol.com",
                    password: "123456",
                    name: "Terungwa Kombol"
                });
            };
            expect(registeredUser).to.throw();
        });
    });
});
