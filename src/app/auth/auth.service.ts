import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseApi } from 'app/core/models/response-api.model';
import { AuthApiService } from 'app/core/services-api/auth-api.service';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

interface usuario {
  id:number,
  username:string,
  email:string,  
  perfil:perfil
}

interface perfil {
  id:number,
  descri:string,  
  nombre:string,  
  permisos: permiso[]
}

interface permiso {
  id:number,
  descri:string,  
  nombre:string,  
  rol: string,
  visible: boolean,
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  public _authenticated = signal<boolean>(false);
  public _user = signal<usuario | null>(null);    
  
  constructor(
    private _authApiService: AuthApiService,
    private _router: Router
  ) { }

  signIn(credentials:{username:string, password:string}):Observable<any>{
    if ( this._authenticated() ){
        return throwError('El usuario ya esta logueado');
    }
    localStorage.removeItem('auth_token');
    return this._authApiService.signIn(credentials).pipe(
      tap((response: any) => {        
        localStorage.setItem('auth_token', response.token);
        this._user.set(response.user);
        this._authenticated.set(true);        
      })
    );
  }

  signOut(): void{
    localStorage.removeItem('auth_token');
    this._user.set(null);
    this._authenticated.set(false);    
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  checkToken(): Observable<boolean>{
    return this._authApiService.checkMe().pipe(
      tap((response: ResponseApi) => {
        this._user.set(response.data);
        this._authenticated.set(true);        
      }),
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );  
  }

  register(data:{username:string, password:string, email:string}):Observable<any>{
    localStorage.removeItem('auth_token');
    return this._authApiService.register(data).pipe(
      tap((response: any) => {        
        localStorage.setItem('auth_token', response.token);
        this._user.set(response);
        this._authenticated.set(true);        
      })
    );
  }
  
}
