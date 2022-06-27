import IUserDao from "@interfaces/dao/IUserDao";
import { UserRepository } from "@repository/UserRepository";
import IUser from "@models/entities/User";
import { Singleton, OnlyInstantiableByContainer } from "typescript-ioc";

@Singleton
@OnlyInstantiableByContainer
export default class UserDaoImpl implements IUserDao {
  public async saveUser(id: string): Promise<IUser> {
    const res = await UserRepository.create({ userID: id });
    return res ? res.toObject() : Promise.reject();
  }

  public async getUserById(id: string): Promise<IUser> {
    const res = await UserRepository.findOne({ userID: id })
      .exec();
    return res ? res.toObject() : Promise.reject();
  }

  public async updateUser(user: IUser): Promise<IUser> {
    const res = await UserRepository.findOneAndUpdate({ userID: user.userID }, user, {
      new: true,
    }).exec();
    return res ? Promise.resolve(res.toObject()) : Promise.reject();
  }

  public async deleteUserById(id: string): Promise<IUser> {
    const res = await UserRepository.findOneAndDelete({
      userID: id,
    }).exec();
    return res ? res.toObject() : Promise.reject();
  }
}
