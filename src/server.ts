import cors from "cors";
import express, { NextFunction, Response } from "express";
import uuid from "uuid";
import route from "./routes";
import { IRequest } from "./types";

import { apiErrorHandler, appLogInfoMiddleware } from "./middlewares";

export const init = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req: IRequest, res: Response, next: NextFunction) => {
    req.requestId = uuid();
    next();
  });

  app.use(appLogInfoMiddleware);
  app.use("/", route);
  app.use(apiErrorHandler);
  return app;
};
