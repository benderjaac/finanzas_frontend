import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiSimple } from '../models/response-api.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceUsuarioService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor() {
    this.urlApi=environment.apiUrl;
  }

  getDataBalanceUsuario():Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.get<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/balance/usuario');
  }
}
