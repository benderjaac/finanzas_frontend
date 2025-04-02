import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
private _router = inject(Router);
public _authService = inject(AuthService);

singOut():void{
  this._router.navigate(['/sign-out']);
  /*this._authService.signOut().subscribe({
    next:()=>{

    },
    error:()=>{
      console.error('Error al cerrar sesion');
    }
  });*/
}
}
