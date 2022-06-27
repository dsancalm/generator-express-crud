/*
Es necesario realizar una interfaz con clase abstracta en vez de interface.
Typescript interfaces only exist at development time, to ensure type checking. 
When compiled, they do not generate runtime code. 
This ensures good performance, but also means that is not possible to use interfaces as the type of a property being injected. 
There is no runtime information that could allow any reflection on interface type. 
Take a look at https://github.com/Microsoft/TypeScript/issues/3628 for more information about this.
*/

import IUser from "@models/entities/User";

export default abstract class IUserDao {
  abstract saveUser(id: string): Promise<IUser>;
  abstract getUserById(id: string): Promise<IUser>;
  abstract updateUser(user: IUser): Promise<IUser>;
  abstract deleteUserById(id: string): Promise<IUser>;
}
