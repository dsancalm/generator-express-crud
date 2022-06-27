import { GUION, VACIO } from "@common/constants";
import {
  Container,
  Inject,
  OnlyInstantiableByContainer,
  Singleton,
} from "typescript-ioc";
import { v4 as uuidv4 } from "uuid";
import IUserService from "@interfaces/service/IUserService";
import IUserDao from "@interfaces/dao/IUserDao";
import {
  UserResponse,
  UserData,
  UserDetail,
} from "@models/response/userResponse";
import UserDaoImpl from "@dao/UserDaoImpl";
import { BaseResponse } from "@models/response/BaseResponse";
import {
  ErrorDetail,
  ErrorResponse,
} from "@models/response/errorResponse";
import User from "@models/entities/User";

Container.bind(IUserDao).to(UserDaoImpl);

@Singleton
@OnlyInstantiableByContainer
export class UserServiceImpl implements IUserService {
  private userDao: IUserDao;

  constructor(@Inject userDao: IUserDao) {
    this.userDao = userDao;
  }

  public async deleteUserById(id: string): Promise<BaseResponse> {
    try {
      await this.userDao
        .deleteUserById(id);
      const detail = new UserDetail();
      return new UserResponse(detail, undefined);
    } catch {
      const detailError = new ErrorDetail("404", "AAA");
      return Promise.reject(new ErrorResponse(detailError));
    }
  }

  public async updateUser(user: User): Promise<BaseResponse> {
    try {
      const userUpdated = await this.userDao
        .updateUser(user);
      const data = new UserData(userUpdated);
      const detail = new UserDetail();
      return new UserResponse(detail, data);
    } catch {
      const detailError = new ErrorDetail("404", "AAA");
      return Promise.reject(new ErrorResponse(detailError));
    }
  }

  public async getUserById(id: string): Promise<BaseResponse> {
    try {
      const user = await this.userDao
        .getUserById(id);
      const data = new UserData(user);
      const detail = new UserDetail();
      return new UserResponse(detail, data);
    } catch {
      const detailError = new ErrorDetail("404", "AAA");
      return Promise.reject(new ErrorResponse(detailError));
    }
  }

  public async generateNewUser(): Promise<BaseResponse> {
    const uniqueId = uuidv4().replaceAll(GUION, VACIO).toLowerCase();
    try {
      const userGenerated = await this.userDao
        .saveUser(uniqueId);
      const data = new UserData(userGenerated);
      const detail = new UserDetail();
      return new UserResponse(detail, data);
    } catch {
      const detailError = new ErrorDetail("404", "AAA");
      return Promise.reject(new ErrorResponse(detailError));
    }
  }
}
