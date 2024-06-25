import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      mongoGet: Document | undefined;
      mongoGetAll: Document[];
      mongoCreate: Document | undefined;
      mongoUpdate: Document | undefined;
      mongoDelete: Document | undefined;
      mongoQuery: Document[];
    }
  }
}

export function declareHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.mongoCreate = undefined;
  req.mongoUpdate = undefined;
  req.mongoGet = undefined;
  req.mongoDelete = undefined;
  req.mongoGetAll = [];
  req.mongoQuery = [];

  next();
}
