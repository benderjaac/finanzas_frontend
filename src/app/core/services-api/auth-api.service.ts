import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseApi } from 'app/core/models/response-api.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  
  private _httpClient = inject(HttpClient);
  private urlApi: string;
  
  constructor(
  ) {
    this.urlApi='localhost';
  }

  signIn(credentials:any):Observable<ResponseApi>{
    return this._httpClient.post<ResponseApi>(this.urlApi+'login', credentials);
  }
}
