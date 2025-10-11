import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseApiSimple } from '../models/response-api.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceUsuarioService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  private disponibleSubject = new BehaviorSubject<number>(0);
  disponible$ = this.disponibleSubject.asObservable();

  constructor() {
    this.urlApi=environment.apiUrl;
  }

  setDisponible(valor: number) {
    this.disponibleSubject.next(valor);
  }

  getDisponibleValue(): number {
    return this.disponibleSubject.value;
  }  
  
  getDataBalanceUsuario():Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.get<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/balance/usuario');
  }
}
