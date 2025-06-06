import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Gasto } from '../models/gasto.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { ApiQuery } from '../models/query.model';

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;
    
  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getDataGastos(query: ApiQuery):Observable<any>{
    return this._httpClient.post<any>(this.urlApi+'/api/gastos/data', query);
  }

  createGasto(data:any):Observable<ResponseApiSimple<Gasto>>{
    return this._httpClient.post<ResponseApiSimple<Gasto>>(this.urlApi+'/api/gastos', data);
  }
}
