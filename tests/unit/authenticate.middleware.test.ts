import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Response } from "express";
import { spy } from "sinon";
const { expect } = chai;
import {
    authenticateMiddleware
} from "../../src/middlewares";
import {
    signJwt
} from "../../src/services";
import { IRequest } from "../../src/types";
chai.use(chaiAsPromised);


describe.only("Authentication Middleware: ", function () {
    it("should throw error when no authorization is provided", async function () {
        // let token = req.query.access_token || req.headers.authorization;
        const req = {} as IRequest;
        const res = {} as Response;
        const next = spy();

        function noAuthorizationTokens() {
            throw authenticateMiddleware(req, res, next);
        }
        expect(noAuthorizationTokens).to.throw();
    });

    it("should throw error when authorization is an empty string", async function () {
        // let token = req.query.access_token || req.headers.authorization;
        const req = {
            headers: {
                authorization: ""
            }
        } as IRequest;
        const res = {} as Response;
        const next = spy();

        function emptyAuthorizationString() {
            throw authenticateMiddleware(req, res, next);
        }
        expect(emptyAuthorizationString).to.throw();
    });

    it("should throw error when token string is invalid", async function () {
        // let token = req.query.access_token || req.headers.authorization;
        const req = {
            headers: {
                authorization: "  "
            }
        } as IRequest;
        const res = {} as Response;
        const next = spy();

        function invalidTokenString() {
            throw authenticateMiddleware(req, res, next);
        }
        expect(invalidTokenString).to.throw();
    });

    it("Should authenticate user with valid authorization token", async function () {
        const token = await signJwt({ id: "1" }, "1h");
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        } as IRequest;
        const res = {} as Response;
        const next = spy();

        await authenticateMiddleware(req, res, next);
        expect(next.calledOnce).to.equal(true);
    });
});
