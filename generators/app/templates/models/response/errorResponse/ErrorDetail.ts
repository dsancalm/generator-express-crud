import { BaseResponseDetail } from "../BaseResponseDetail";

export class ErrorDetail extends BaseResponseDetail {

    constructor(status:string, code:string){
        super(status,code);
    }
}