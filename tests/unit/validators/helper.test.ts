import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
   validateEmail,
   validatePassword,
   validateString
} from "../../../src/middlewares/validators/helpers";

describe("Validator helpers: ", function () {
    describe("User Email", function() {
        it("should validate user email", async function () {
            const isValid = validateEmail("kombol@kombol.com")
            expect(isValid).to.equal(true);
        });

        it("should throw error for invalid user email", async function () {
            function notValidEmail() {
                throw validateEmail("kombol");
            }
            expect(notValidEmail).to.throw();
        });
    });

    describe("User Password", function() {
        it("should validate user password", async function () {
            const isValid = validatePassword("123456")
            expect(isValid).to.equal(true);
        });

        it("should throw error for invalid password", async function () {
            function notValidPassword() {
                throw validatePassword("12");
            }
            expect(notValidPassword).to.throw();
        });
    });

    describe("User String", function() {
        it("should validate user input is a string", async function () {
            const isValid = validateString("kombol")
            expect(isValid).to.equal(true);
        });

        it("should throw error when user input not a string", async function () {
            function notValidString() {
                throw validateString(1234);
            }
            expect(notValidString).to.throw();
        });
    });
});
