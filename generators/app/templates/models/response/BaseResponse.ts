import { BaseResponseData } from "./BaseResponseData";
import { BaseResponseDetail } from "./BaseResponseDetail";


export class BaseResponse {
    
    public request:BaseResponseDetail;
    public data:BaseResponseData | undefined;

    constructor(request:BaseResponseDetail, data?:BaseResponseData){
        this.request = request;
        this.data = data;
    }
    

}