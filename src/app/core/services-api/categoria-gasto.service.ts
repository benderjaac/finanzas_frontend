import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiQuery } from '../models/query.model';
import { Observable } from 'rxjs';
import { ResponseApiCat, ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { CategoriaGasto } from '../models/categoria-gasto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGastoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor() { 
    this.urlApi=environment.apiUrl;
  }

  getDataCategorias(query: ApiQuery):Observable<ResponseApiType<CategoriaGasto>>{
    return this._httpClient.post<ResponseApiType<CategoriaGasto>>(this.urlApi+'/api/categoria/data', query);
  }

  getDataCategoriasCat():Observable<ResponseApiCat<CategoriaGasto>>{
    return this._httpClient.get<ResponseApiCat<CategoriaGasto>>(this.urlApi+'/api/categoria/catalogo');
  }

  getDataCategoriasGastosCat():Observable<ResponseApiCat<CategoriaGasto>>{
    return this._httpClient.get<ResponseApiCat<CategoriaGasto>>(this.urlApi+'/api/categoria/catalogo/gastos');
  }

  getDataCategoriasIngresosCat():Observable<ResponseApiCat<CategoriaGasto>>{
    return this._httpClient.get<ResponseApiCat<CategoriaGasto>>(this.urlApi+'/api/categoria/catalogo/ingresos');
  }

  createCategoria(data: Partial<CategoriaGasto>):Observable<ResponseApiSimple<CategoriaGasto>>{
    return this._httpClient.post<ResponseApiSimple<CategoriaGasto>>(this.urlApi+'/api/categoria', data);
  }


}
