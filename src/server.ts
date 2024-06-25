import http from "http";
import express from "express";
import { logger } from "./config/logger";
import { loggingHandler } from "./middleware/loggingHandler";
import { corsHandler } from "./middleware/corsHandler";
import { routeNotFound } from "./middleware/routeNotFound";
import { MONGO, SERVER_HOSTNAME, SERVER_PORT } from "./config/config";
import "reflect-metadata";
import mongoose, { mongo } from "mongoose";
import { defineRoutes } from "./modules/routes";
import MainController from "./controller/main";
import { declareHandler } from "./middleware/declareHandler";
import BooksController from "./controller/books";

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
  logger.info("---------------------------------------------");
  logger.info("Initializing the User API");
  logger.info("---------------------------------------------");
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());

  logger.info("---------------------------------------------");
  logger.info("Connect to Mongo");
  logger.info("---------------------------------------------");
  try {
    const connection = await mongoose.connect(
      MONGO.MONGO_CONNECTION,
      MONGO.MONGO_OPTIONS
    );
    logger.info("---------------------------------------------");
    logger.info("Connected to Mongo: " + connection.version);
    logger.info("---------------------------------------------");
  } catch (error) {
    logger.info("---------------------------------------------");
    logger.info("Unable to connect to Mongo ");
    logger.error(error);
    logger.info("---------------------------------------------");
  }

  logger.info("---------------------------------------------");
  logger.info("Logging and Configuration");
  logger.info("---------------------------------------------");
  application.use(loggingHandler);
  application.use(corsHandler);
  application.use(declareHandler);
  logger.info("---------------------------------------------");
  logger.info("Healthcheck");
  logger.info("---------------------------------------------");
  defineRoutes([MainController, BooksController], application);

  logger.info("---------------------------------------------");
  logger.info("Define Controller Routing");
  logger.info("---------------------------------------------");
  application.use(routeNotFound);

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
