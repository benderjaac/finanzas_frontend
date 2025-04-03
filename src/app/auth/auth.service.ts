import { Inject, Injectable, signal } from '@angular/core';
import { ResponseApi } from 'app/core/models/response-api.model';
import { AuthApiService } from 'app/core/services-api/auth-api.service';
import { Observable, of, throwError } from 'rxjs';

interface usuario {
  name:string,
  id:number,
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  public _authenticated = signal<boolean>(false);
  public _user = signal<usuario>({name:'', id:0});
  
  constructor(
    private _authApiService: AuthApiService
  ) { }

  signIn(user:string, id:number):Observable<any>{
    if ( this._authenticated() )
    {
        return throwError('El usuario ya esta logueado');
    }
    this._authApiService.signIn({user:user, pass:'123'}).subscribe({
      next: (response:ResponseApi) =>{
        console.log('respuesta: ', response);
      },
      error: (error:any) =>{
        console.log('Error: ', error);
      },
    });
    this._user.set({name:user, id:id});
    this._authenticated.set(true);
    return of(true);
  }

  signOut(): Observable<any>{
    this._authenticated.set(false);
    return of(true);
  }
  
}
