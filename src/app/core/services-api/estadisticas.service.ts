import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiCat, ResponseApiSimple } from '../models/response-api.model';
import { TotalMeses } from '../models/estadisticas.model';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor() {
    this.urlApi=environment.apiUrl;
  }

  getTotalMeses():Observable<ResponseApiCat<TotalMeses>>{
    return this._httpClient.get<ResponseApiCat<TotalMeses>>(this.urlApi+'/api/estadisticas/totalesmes');
  }
  
}
