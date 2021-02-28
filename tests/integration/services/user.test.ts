import chai from "chai";
import { ObjectID } from "mongodb";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    authenticateUser,
    createUser,
    confirmUserDoesNotExist,
    editUser
} from "../../../src/services";

import { UsersModelInterface } from "../../../src/types";
import { userCollection } from "../db";

const {
    populate,
    reset
} = userCollection;

describe("User Service: ", function () {
    beforeEach(async function () {
        await populate();
    });
    afterEach(async function () {
        await reset();
    });
    describe("User Service: Registration", function () {
        it("should return true for user not yet resgistered", async function () {

            const exists = await confirmUserDoesNotExist("komb@kombol.com");
            expect(exists).to.equal(true);
        });

        it("should throw error for user already registered", async function () {
            function alreadyRegistered() {
                throw confirmUserDoesNotExist("kombol@kombol.com");
            };
            expect(alreadyRegistered).to.throw();
        });

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

    describe("User Service: Authentication", function () {
        it("should successfully authenticate a registered user", async function () {
            await createUser({
                email: "john@doe.com",
                name: "John Doe",
                password: "123456"
            });
            const authenticatedUser = await authenticateUser({
                email: "john@doe.com",
                password: "123456"
            }) as string;
            expect(typeof authenticatedUser).to.equal("string");
        });

        it("should throw an error for user that does not exist", function () {
            function authenticatedUser() {
                throw authenticateUser({
                    email: "john@doe.com",
                    password: "12345",
                });
            };
            expect(authenticatedUser).to.throw();
        });

        it("should throw an error for a wrong password", function () {
            function authenticatedUser() {
                throw authenticateUser({
                    email: "kombol@kombol.com",
                    password: "abc123",
                });
            };
            expect(authenticatedUser).to.throw();
        });
    });

    describe("User Service: Edit user info", function () {
        it("should successfully change a users email and password", async function () {
            const editedUser = await editUser({
                name: "john",
                email: "john@doe.com",
                confirmEmail: "john@doe.com",
                password: "1111111",
                confirmPassword: "1111111",
                userId: new ObjectID("5f0f5bb7786b1c0e246357a4")
            }) as UsersModelInterface;

            console.log("edited user", editedUser);
            expect(editedUser.email).to.equal("john@doe.com");
            expect(editedUser.name).to.equal("john");
        });
    });
});
