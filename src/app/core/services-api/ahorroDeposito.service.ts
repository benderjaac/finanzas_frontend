import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiQuery } from '../models/query.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { Ingreso } from '../models/ingreso.model';
import {AhorroDeposito} from '../models/ahorro-deposito.model';

@Injectable({
  providedIn: 'root'
})
export class AhorroDepositoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getData(idahorro:number, query: ApiQuery):Observable<ResponseApiType<AhorroDeposito>>{
    return this._httpClient.post<ResponseApiType<AhorroDeposito>>(this.urlApi+'/api/ahorros/depositos/data/'+idahorro, query);
  }

  create(idAhorro:number, data:Partial<AhorroDeposito>):Observable<ResponseApiSimple<AhorroDeposito>>{
    return this._httpClient.post<ResponseApiSimple<AhorroDeposito>>(this.urlApi+'/api/ahorros/depositos/'+idAhorro, data);
  }

  update(idAhorro:number, data:Partial<Ingreso>, idDeposito:number):Observable<ResponseApiSimple<Ingreso>>{
    return this._httpClient.put<ResponseApiSimple<Ingreso>>(this.urlApi+'/api/ahorros/depositos/'+idAhorro+'/'+idDeposito, data);
  }
}
