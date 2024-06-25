import { NextFunction, Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import { logger } from "../../config/logger";

export function MongoCreate(model: Model<any>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const orginalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const document = new model({
          _id: new mongoose.Types.ObjectId(),
          ...req.body,
        });

        await document.save();

        req.mongoCreate = document;
      } catch (error) {
        logger.error(error);
        return res.status(500).json({ error });
      }

      return orginalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}
