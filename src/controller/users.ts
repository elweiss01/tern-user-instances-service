import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { Controller } from "../decorators/controller";
import { Route } from "../decorators/route";
import Joi, { string } from "joi";
import { MongoGet } from "../decorators/mongoose/get";
import { MongoCreate } from "../decorators/mongoose/create";
import { MongoQuery } from "../decorators/mongoose/query";
import { MongoUpdate } from "../decorators/mongoose/update";
import { MongoDelete } from "../decorators/mongoose/delete";
import { User } from "../models/user";
import { Validate } from "../decorators/validate";

const postUserValidate = Joi.object({
  email: Joi.string().email(),
  role: Joi.array().items(Joi.string()),
});

@Controller("/Users")
class UsersController {
  @Route("get", "/get/:id")
  @MongoGet(User)
  get(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json(req.mongoGet);
  }

  @Route("post", "/create")
  @Validate(postUserValidate)
  @MongoCreate(User)
  create(req: Request, res: Response, next: NextFunction) {
    return res.status(201).json(req.mongoCreate);
  }

  @Route("post", "/query")
  @MongoQuery(User)
  query(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json(req.mongoQuery);
  }

  @Route("patch", "/update/:id")
  @MongoUpdate(User)
  update(req: Request, res: Response, next: NextFunction) {
    return res.status(201).json(req.mongoUpdate);
  }

  @Route("delete", "/delete/:id")
  @MongoDelete(User)
  delete(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({ mesage: "deleted" });
  }
}

export default UsersController;
