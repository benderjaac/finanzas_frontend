import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiQuery } from '../models/query.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { Ingreso } from '../models/ingreso.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;
    
  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getDataIngresos(query: ApiQuery):Observable<ResponseApiType<Ingreso>>{
    return this._httpClient.post<ResponseApiType<Ingreso>>(this.urlApi+'/api/ingresos/data', query);
  }

  createIngreso(data:Partial<Ingreso>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.post<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/ingresos', data);
  }

  updateIngreso(id:number, data:Partial<Ingreso>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.put<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/ingresos/'+id, data);
  }

  deleteIngreso(id:number):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.delete<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/ingresos/'+id);
  }
}
