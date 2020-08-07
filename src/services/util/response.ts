import { Response } from "express";

export interface ApiResponseInterface {
    response: Response;
    message: string;
    data: object;
    statusCode: number;
}
export const apiResponse = (apiResponseData: ApiResponseInterface) => {
    const { message, data, statusCode, response } = apiResponseData;
    response.status(statusCode);
    response.send({
        code: statusCode,
        message,
        data
    });
    return response;
};
