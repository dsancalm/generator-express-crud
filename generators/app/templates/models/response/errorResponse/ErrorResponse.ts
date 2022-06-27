import { BaseResponse } from "../BaseResponse";
import { ErrorDetail } from "./ErrorDetail";


export class ErrorResponse extends BaseResponse {

    constructor(request:ErrorDetail){
        super(request);
    }
}