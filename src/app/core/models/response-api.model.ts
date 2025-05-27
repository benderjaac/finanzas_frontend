import { User } from "./user.model"

export interface ResponseApi{
    title:string,
    status:string,
    message:string,
    timestamp:string
}

export interface ResponseType<T> extends ResponseApi{
    data:T[]    
}

export interface ResponseSimple<T> extends ResponseApi{
    data:T    
}

export interface ResponseAuth{
    user:User,
    token:string,    
}