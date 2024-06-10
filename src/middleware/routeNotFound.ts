import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error("Route Not Found");
  logger.error(error);

  return res.status(404).json({ error: error.message });
}
