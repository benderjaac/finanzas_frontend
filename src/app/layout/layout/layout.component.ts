import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule, DrawerModule, AvatarModule, Ripple, StyleClass],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  
  private _router = inject(Router);
  public _authService = inject(AuthService);

  showSidebar = signal(false);
  isMobile = signal(window.innerWidth <= 768);

  constructor() {
    if(!this.isMobile()){
        this.showSidebar.set(true);
      } 
    window.addEventListener('resize', () => {
      this.showSidebar.set(false);
      this.isMobile.set(window.innerWidth <= 768); 
      if(!this.isMobile()){
        this.showSidebar.set(true);
      }     
    });
  }
  
  toggleSidebar() {
    this.showSidebar.set(!this.showSidebar());
  }

  singOut():void{
    this._router.navigate(['/sign-out']);  
  }
}
