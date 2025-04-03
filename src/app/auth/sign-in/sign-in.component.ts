import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseApi } from 'app/core/models/response-api.model';

@Component({
  selector: 'app-sign-in',
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  
  singIn(usuario:string, id:number):void{
    this._authService.signIn(usuario, id).subscribe({
      next: (resp:ResponseApi)=>{
        if(resp.status==='OK'){
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
          this._router.navigateByUrl(redirectURL);
        }else{
          console.log('error iniciar sesion');
        }       
      },
      error: ()=>{}
    });
  }
}
