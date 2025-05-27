import { User } from "./user.model"

export interface ResponseApi{
    title:string,
    status:string,
    message:string,
    timestamp:string
}

export interface ResponseApiType<T> extends ResponseApi{
    data:T[]    
}

export interface ResponseApiSimple<T> extends ResponseApi{
    data:T    
}

export interface ResponseAuth{
    user:User,
    token:string,    
}