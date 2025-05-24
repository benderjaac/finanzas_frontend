import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService, PermisoDTO } from 'app/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule, DrawerModule, AvatarModule, PanelMenuModule, Ripple],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  
  private _router = inject(Router);
  public _authService = inject(AuthService);

  showSidebar = signal(false);
  isMobile = signal(window.innerWidth <= 768);

  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService
  ) {
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

  ngOnInit():void{
    const perfilMenu = this.authService._user()?.perfil.menu;
    if(perfilMenu!=undefined){
      this.menuItems = this.mapPermisosToMenu(perfilMenu[0].hijos);
    }    
  }
  
  toggleSidebar() {
    this.showSidebar.set(!this.showSidebar());
  }

  singOut():void{
    this._router.navigate(['/sign-out']);  
  }

  mapPermisosToMenu(permisos: PermisoDTO[]): MenuItem[] {
    return permisos
      .map(p => ({
        label: p.nombre ?? undefined,
        visible: p.visible,
        expanded: true,
        tooltip: p.descri ?? undefined,
        icon: p.icon || 'pi pi-fw pi-folder',
        routerLink: p.link ? [`/${p.link}`] : undefined,
        items: p.hijos && p.hijos.length > 0 ? this.mapPermisosToMenu(p.hijos) : undefined
      }));
  }
}
