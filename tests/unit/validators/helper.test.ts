import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
   isEmail,
   isAlphanumeric,
   hasMinLength
} from "../../../src/middlewares/validators/helpers";

describe("Validator helpers: ", function () {
    describe("User Email", function() {
        it("should validate user email", async function () {
            const isValid = isEmail({ prop: "kombol@kombol.com" })
            expect(isValid).to.equal(true);
        });

        it("should throw error for invalid user email", async function () {
            function notValidEmail() {
                throw isEmail({ prop: "kombol" });
            }
            expect(notValidEmail).to.throw();
        });
    });

    describe("User Password", function() {
        it("should have accepted length", async function () {
            const isValid = hasMinLength({ prop: "123456", minLength: 6 })
            expect(isValid).to.equal(true);
        });

        it("should throw error is not alphanumeric", async function () {
            function notValidPassword() {
                throw isAlphanumeric({ prop: "122" });
            }
            expect(notValidPassword).to.throw();
        });
    });
});
