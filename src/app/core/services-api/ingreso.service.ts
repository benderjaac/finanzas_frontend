import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiQuery } from '../models/query.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { Ingreso } from '../models/ingreso.model';

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

  createIngreso(data:Partial<Ingreso>):Observable<ResponseApiSimple<Ingreso>>{
    return this._httpClient.post<ResponseApiSimple<Ingreso>>(this.urlApi+'/api/ingresos', data);
  }
}
