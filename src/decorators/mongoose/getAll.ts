import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { logger } from "../../config/logger";

export function MongoGetAll(model: Model<any>) {
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
        const documents = await model.find();
        req.mongoGetAll = documents;
      } catch (error) {
        logger.error(error);
        return res.status(500).json({ error });
      }

      return orginalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}
