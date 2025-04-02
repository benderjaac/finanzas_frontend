import { Injectable, signal } from '@angular/core';
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

  constructor() { }

  signIn(user:string, id:number):Observable<any>{
    if ( this._authenticated() )
    {
        return throwError('El usuario ya esta logueado');
    }
    this._user.set({name:user, id:id});
    this._authenticated.set(true);
    return of(true);
  }

  signOut(): Observable<any>{
    this._authenticated.set(false);
    return of(true);
  }
  
}
