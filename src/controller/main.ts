import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { Controller } from "../decorators/controller";
import { Route } from "../decorators/route";

@Controller()
class MainController {
  @Route("get", "/healthcheck")
  @Route("post", "/healthcheck")
  getHealthCheck(req: Request, res: Response, next: NextFunction) {
    logger.info("Health Check Successfully");
    return res.status(200).json({ health: "Looks Good", ...req.body });
  }
}

export default MainController;
