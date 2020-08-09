import { NextFunction, Response } from "express";

import { apiResponse, viewColors, ColorInterface } from "../../services";
import { IRequest } from "../../types";

export const viewProjectColorsControllerDefinition = (
    viewProjectColors: () => ColorInterface[]
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const colors = viewProjectColors();
            return apiResponse({
                message: "colors successfully fetched",
                data: {
                    colors
                },
                response: res,
                statusCode: 200
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewProjectColorsController = viewProjectColorsControllerDefinition(
    viewColors
);
