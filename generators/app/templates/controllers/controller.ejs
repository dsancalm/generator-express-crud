import IUserService from "@interfaces/service/IUserService";
import IUser from "@models/entities/User";
import { UserServiceImpl } from "@service/UserServiceImpl";
import express from "express";
import { Container, Inject } from "typescript-ioc";

Container.bind(IUserService).to(UserServiceImpl);

export class UserController {
  private userService: IUserService;

  constructor(@Inject userService: IUserService) {
    this.userService = userService;
  }

  public generateUser(_req: express.Request, res: express.Response) {
    this.userService
      .generateNewUser()
      .then((respuestaService) => {
        res.status(200).send(respuestaService);
      })
      .catch((respuestaService) => {
        res.status(404).send(respuestaService);
      });
  }

  public getUser(req: express.Request, res: express.Response) {
    const id: string = req.query.id as string;
    this.userService
      .getUserById(id)
      .then((respuestaService) => {
        res.status(200).send(respuestaService);
      })
      .catch((respuestaService) => {
        res.status(404).send(respuestaService);
      });
  }

  public deleteUser(req: express.Request, res: express.Response) {
    const id: string = req.query.id as string;
    this.userService
      .deleteUserById(id)
      .then((respuestaService) => {
        res.status(200).send(respuestaService);
      })
      .catch((respuestaService) => {
        res.status(404).send(respuestaService);
      });
  }

  public updateUser(req: express.Request, res: express.Response) {
    const user: IUser = req.body.user as IUser;
    this.userService
      .updateUser(user)
      .then((respuestaService) => {
        res.status(200).send(respuestaService);
      })
      .catch((respuestaService) => {
        res.status(404).send(respuestaService);
      });
  }
}
