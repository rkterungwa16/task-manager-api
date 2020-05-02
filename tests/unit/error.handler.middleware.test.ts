import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Response } from "express";
import { mock, spy } from "sinon";
import {
    apiErrorHandler,
} from "../../src/middlewares";
import {
    error
} from "../../src/services";
import { IRequest } from "../../src/types";
chai.use(chaiAsPromised);


describe("Error Handler Middleware: ", function () {
    it("Should call response send and status", function () {
        const req = {} as IRequest;
        const res = {
            status (code: number){ return },
            send(body: any) { return }
        } as Response;
        const next = spy();
        const mockRes = mock(res);
        const authError = error(
            401,
            "Token string not valid",
            "Authentication"
        );

        mockRes.expects('status').once().withExactArgs(401);
        mockRes.expects('send').once().withExactArgs({
            code: 401,
            message: "Token string not valid"
        });
        apiErrorHandler(authError, req, res, next);
        mockRes.verify();
    });
});
