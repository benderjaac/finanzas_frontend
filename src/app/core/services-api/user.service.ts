import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiType } from '../models/response-api.model';
import { User } from '../models/user.model';
import { ApiQuery } from '../models/query.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;
    
  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getUsers():Observable<ResponseApiType<User>>{
    return this._httpClient.get<ResponseApiType<User>>(this.urlApi+'/api/users');
  }

  getDataUsers(query: ApiQuery):Observable<any>{
    return this._httpClient.post<any>(this.urlApi+'/api/users/data', query);
  }
}
