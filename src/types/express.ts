import { Request } from "express";
import { UsersModelInterface } from "./";
export interface IRequest extends Request {
  requestId?: string;
  currentUser?: UsersModelInterface;
}
