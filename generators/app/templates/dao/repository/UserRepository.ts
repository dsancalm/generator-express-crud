import IUser from "@models/entities/User";
import { Document, Schema, model } from "mongoose";

interface IUserDocument extends IUser, Document {}

const UserFields: Record<keyof IUser, any> = {
  userID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  }
};

const UserSchema = new Schema(UserFields, {
  toObject: {
    transform: function (_doc, ret) {

      const userKeysFields = Object.keys(UserFields);
      const mongoKeysFields = Object.keys(ret);
      
      mongoKeysFields.forEach((key) => {
        if(!userKeysFields.includes(key)){
          delete ret[key];
        }
      })
      return ret;
    },
  },
});




const UserRepository = model<IUserDocument>("Users", UserSchema);

export { UserRepository, IUserDocument };