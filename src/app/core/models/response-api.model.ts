import { Ahorro } from "./ahorro.model"
import { CategoriaGasto } from "./categoria-gasto.model"
import { CategoriaIngreso } from "./categoria-ingreso.model"
import { User } from "./user.model"

export interface ResponseApi{
    title:string,
    status:string,
    message:string,
    timestamp:string
}

export interface ResponseApiType<T> extends ResponseApi{
    result:{
        data: T[],
        pagination: Pagination
    }
}

export interface ResponseApiSimple<T> extends ResponseApi{
    result:T    
}

export interface ResponseApiCat<T> extends ResponseApi{
    result:{
        data: T[],
    }
}

export interface Pagination{
    currentPage: number,
    nextPage:number,
    perPage:number | null,
    prevPage:number | null,
    totalItems: number,
    totalPages: number,
}

export interface ResponseAuth{
    user:User,
    token:string,    
}

export interface CatalogoMap {
  categorias_gastos: ResponseApiCat<CategoriaGasto>;
  categorias_ingresos: ResponseApiCat<CategoriaIngreso>;
  ahorros: ResponseApiCat<Ahorro>;
  // otros catálogos...
}