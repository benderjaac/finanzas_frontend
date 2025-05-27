import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Gasto } from '../models/gasto.model';
import { Observable } from 'rxjs';
import { ResponseApiType } from '../models/response-api.model';

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

  getGastos():Observable<ResponseApiType<Gasto>>{
    return this._httpClient.get<ResponseApiType<Gasto>>(this.urlApi+'/api/gastos');
  }
}
