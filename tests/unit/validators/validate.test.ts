import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Request, Response } from "express";
import { spy } from "sinon";
const { expect } = chai;
import {
    validateLoginInputs,
    validateRegistrationInputs
 } from "../../../src/middlewares";
chai.use(chaiAsPromised);

describe("Request Input Validation Middleware: ", function () {
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

    describe("Registraton Input Validation", function() {
        it("should throw error when there is no registration details", async function () {
            const req = {
                body: {}
            } as Request;
            const res = {} as Response;
            const next = spy();

            function emptyRequestDetails() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(emptyRequestDetails).to.throw();
        });
        it("should throw error for missing email", async function () {
            const req = {
                body: {
                    password: "123456",
                    name: "Kombol"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function missingEmail() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(missingEmail).to.throw();
        });
        it("should throw error for missing name", async function () {
            const req = {
                body: {
                    password: "123456",
                    email: "kombol@kombol.com"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function missingName() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(missingName).to.throw();
        });
        it("should throw error for missing password", async function () {
            const req = {
                body: {
                    name: "Kombol",
                    email: "kombol@kombol.com"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function missingPassword() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(missingPassword).to.throw();
        });
        it("should throw error for wrong password detail", async function () {
            const req = {
                body: {
                    password: "1234",
                    email: "kombol@kombol.com",
                    name: "Kombol"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function wrongPassword() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(wrongPassword).to.throw();
        });
        it("should throw error for wrong email detail", async function () {
            const req = {
                body: {
                    password: "123456",
                    email: "kombol",
                    name: "Kombol"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function wrongEmail() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(wrongEmail).to.throw();
        });

        it("should throw error for wrong name detail", async function () {
            const req = {
                body: {
                    password: "123456",
                    email: "kombol@kombol.com",
                    name: "  "
                }
            } as Request;
            const res = {} as Response;
            const next = spy();

            function wrongName() {
                throw validateRegistrationInputs(req, res, next);
            }
            expect(wrongName).to.throw();
        });
        it("Should allow request with valid registration input details", async function () {
            const req = {
                body: {
                    password: '123456',
                    email: 'kombol@kombol.com',
                    name: "Kombol"
                }
            } as Request;
            const res = {} as Response;
            const next = spy();
            validateRegistrationInputs(req, res, next);
            expect(next.calledOnce).to.equal(true);
        });
    });
});
