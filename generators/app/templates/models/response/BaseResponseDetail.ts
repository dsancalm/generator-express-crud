
export class BaseResponseDetail {

    public status:string;
    public code:string;

    constructor(status:string, code:string){
        this.status = status;
        this.code = code;
    }
}