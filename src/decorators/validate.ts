import { Request, Response, NextFunction } from "express";
import Joi, { func } from "joi";
import { logger } from "../config/logger";

export function Validate(schema: Joi.ObjectSchema) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        await schema.validateAsync(req.body);
      } catch (error) {
        logger.error(error);
        return res.status(422).json(error);
      }

      return originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}
