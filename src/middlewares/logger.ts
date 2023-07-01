import { NextFunction, Response } from "express";
import { TransformableInfo } from "logform";
import { createLogger, format, Logger, transports } from "winston";
import { IRequest } from "../types";

const { label, prettyPrint, combine, timestamp, colorize, printf, ms } = format;

export const createAppLogger = (labelInfo: string): Logger => {
  return createLogger({
    format: combine(
      label({
        label: labelInfo
      }),
      ms(),
      timestamp(),
      prettyPrint(),
      colorize(),
      printf((printInfo: TransformableInfo) => {
        return `${printInfo.ms} ${printInfo.timestamp} [${printInfo.label}] ${printInfo.level}: ${printInfo.message}`;
      })
    ),
    transports: [new transports.Console()]
  });
};

export const appLogInfoMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = getHrTime();
  createAppLogger("Request Information").log({
    level: "info",
    message: `${req.ip}-${req.method}-${req.url}`
  });

  // log the finished requests
  res.once("finish", () => {
    const responseTotalTime = getHrTime() - startTime;
    createAppLogger("Response Information").log({
      level: "info",
      message: `${req.requestId} - ${responseTotalTime} - ${res.statusCode}`
    });
  });

  next();
};

export const getHrTime = () => {
  const ts = process.hrtime();
  return ts[0] * 1000 + ts[1] / 1000000;
};
