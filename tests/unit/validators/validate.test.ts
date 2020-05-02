import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { NextFunction, Request, Response } from "express";
import { spy, stub } from "sinon";
const { expect } = chai;
import {
    validateLoginInputs,
 } from "../../../src/middlewares";
chai.use(chaiAsPromised);

describe.only("Request Input Validation Middleware: ", function () {
    describe("Login Input Validation", function() {
        it("should throw error when there is no login details", async function () {
            const req = {
                body: {}
            } as Request;
            const res = {} as Response;
            const next = spy();

            function emptyRequestDetails() {
                throw validateLoginInputs(req, res, next);
            }
            expect(emptyRequestDetails).to.throw();
        });
        it("should throw error for missing login request property", async function () {
            const req = {
                body: {
                    password: "123456"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function missingEmail() {
                throw validateLoginInputs(req, res, next);
            }
            expect(missingEmail).to.throw();
        });
        it("should throw error for wrong password detail", async function () {
            const req = {
                body: {
                    password: "1234",
                    email: "kombol@kombol.com"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function wrongPassword() {
                throw validateLoginInputs(req, res, next);
            }
            expect(wrongPassword).to.throw();
        });
        it("Should allow request with valid login input details", async function () {
            const req = {
                body: {
                    password: '123456',
                    email: 'kombol@kombol.com'
                }
            } as Request;
            const res = {} as Response;
            const next = spy();
            validateLoginInputs(req, res, next);
            expect(next.calledOnce).to.equal(true);
        });
    });
});
