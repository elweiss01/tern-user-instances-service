import http from "http";
import express from "express";
import { logger } from "./config/logger";
import { loggingHandler } from "./middleware/loggingHandler";
import { corsHandler } from "./middleware/corsHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import { SERVER_HOSTNAME, SERVER_PORT } from "./config/config";
import "reflect-metadata";
import { defineRoutes } from "./modules/routes";
import MainController from "./controller/main";

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = () => {
  logger.info("---------------------------------------------");
  logger.info("Initializing the User API");
  logger.info("---------------------------------------------");
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());

  logger.info("---------------------------------------------");
  logger.info("Logging and Configuration");
  logger.info("---------------------------------------------");
  application.use(loggingHandler);
  application.use(corsHandler);

  logger.info("---------------------------------------------");
  logger.info("Healthcheck");
  logger.info("---------------------------------------------");
  defineRoutes([MainController], application);

  logger.info("---------------------------------------------");
  logger.info("Define Controller Routing");
  logger.info("---------------------------------------------");
  application.use(routeNotFound);

  logger.info("---------------------------------------------");
  logger.info("Starter Server");
  logger.info("---------------------------------------------");
  httpServer = http.createServer(application);
  httpServer.listen(SERVER_PORT, () => {
    logger.info("---------------------------------------------");
    logger.info("Server Started: " + SERVER_HOSTNAME + ":" + SERVER_PORT);
    logger.info("---------------------------------------------");
  });
};

export const shutDown = (callback: any) =>
  httpServer && httpServer.close(callback);

Main();
