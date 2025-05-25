import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, PermisoDTO } from 'app/auth/auth.service';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-menu',
  imports: [Ripple, StyleClass, CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  perfilMenu:PermisoDTO[]=[];

  constructor(
    public _authService: AuthService
  ) {}

  ngOnInit():void{
    this.perfilMenu = this._authService._user()?.perfil.menu ?? [];    
  }
}
