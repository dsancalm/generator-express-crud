import express from "express";
import { Container } from "typescript-ioc";
import { UserController } from "./controller";

const urlPath = "/users";

export const userRouter = express.Router();

const userController = Container.get(UserController);

userRouter.get("/generateUser", (req, res) => {
  userController.generateUser(req, res);
});


userRouter.get("/getUser", (req, res) => {
  userController.getUser(req, res);
});



userRouter.delete("/deleteUser", (req, res) => {
  userController.deleteUser(req, res);
});


userRouter.post("/updateUser", (req, res) => {
  userController.updateUser(req, res);
});
