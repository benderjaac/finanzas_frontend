import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseApi } from 'app/core/models/response-api.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  
  private _httpClient = inject(HttpClient);
  private urlApi: string;
  
  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  signIn(credentials:{username:string, password:string}):Observable<ResponseApi>{
    return this._httpClient.post<ResponseApi>(this.urlApi+'/auth/login', credentials);
  }
}
