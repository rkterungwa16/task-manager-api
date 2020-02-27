import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { expect } = chai;
chai.use(chaiAsPromised);

import {
    signJwt,
    verifyJwt
} from "../../src/services";

describe("JWT Service: ", function () {
    describe("Create a new token", function () {
        it("should create a new token", async function () {
            const token = await signJwt({ id: "1" }, "24");
            expect(typeof token).to.equal("string");
        });
    });

    describe("Verify token", function () {
        it("should verify a valid token", async function () {
            const token = await signJwt({ id: "1" }, "24");
            expect(typeof await verifyJwt(token)).to.equal("object");
        });

        it("should throw an error for an invalid token", function () {
            function token() {
                throw verifyJwt("");
            }
            expect(token).to.throw();
        });
    });
});
