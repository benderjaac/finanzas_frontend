import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule, DrawerModule, AvatarModule, PanelMenuModule, MenuComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

  showSidebar = signal(false);
  isMobile = signal(window.innerWidth <= 768);

  isDarkMode = false;

  constructor(
    public _authService: AuthService,
    private _router: Router
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
    const userPref = localStorage.getItem('theme');
    if (userPref === 'dark' || (!userPref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }  
  }
  
  toggleSidebar() {
    this.showSidebar.set(!this.showSidebar());
  }

  singOut():void{
    this._router.navigate(['/sign-out']);  
  }  

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  private enableDarkMode(): void {
    this.isDarkMode = true;
    document.documentElement.classList.add('dark', 'p-dark');
    document.documentElement.classList.remove('light', 'p-light');
    localStorage.setItem('theme', 'dark');
  }

  private disableDarkMode(): void {
    this.isDarkMode = false;
    document.documentElement.classList.remove('dark', 'p-dark');
    document.documentElement.classList.add('light', 'p-light');
    localStorage.setItem('theme', 'light');
  }
}
