import IUser from "@models/entities/User";
import { BaseResponseData } from "../BaseResponseData";


export class UserData extends BaseResponseData {

    public user:IUser;

    constructor(user:IUser) {
        super();
        this.user = user;
    }
}