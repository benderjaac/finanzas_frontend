import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Gasto } from '../models/gasto.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { ApiQuery } from '../models/query.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

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

  getDataGastos(query: ApiQuery):Observable<ResponseApiType<Gasto>>{
    return this._httpClient.post<ResponseApiType<Gasto>>(this.urlApi+'/api/gastos/data', query);
  }

  createGasto(data:Partial<Gasto>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.post<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/gastos', data);
  }

  updateGasto(id:number, data:Partial<Gasto>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.put<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/gastos/'+id, data);
  }

  deleteGasto(id:number):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.delete<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/gastos/'+id);
  }
}
