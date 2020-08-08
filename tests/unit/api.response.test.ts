import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { Response } from "express";
import { mock } from "sinon";
import {
    apiResponse,
} from "../../src/services";
chai.use(chaiAsPromised);


describe("Api Response: ", function () {
    it("Should return object containing status code", function () {
        const res = {
            status (code: number){ return },
            send (body: any) { return }
        } as Response;
        const mockRes = mock(res);

        const apiResponseData = {
            statusCode: 200,
            response: res,
            message: "success",
            data: {
                project: { name: "" }
            }
        }

        mockRes.expects('status').once().withExactArgs(200);
        mockRes.expects('send').once().withExactArgs({
            code: 200,
            message: "success",
            data: {
                project: { name: "" }
            }
        });
        apiResponse(apiResponseData);
        mockRes.verify();
    });
});
