import { BaseResponse } from "../BaseResponse";
import {UserData } from "./UserData";
import {  UserDetail } from "./UserDetail";


export class UserResponse extends BaseResponse {


    constructor(request:UserDetail, data?:UserData){
        super(request,data);
    }
}