import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { PruebasComponent } from './pruebas/pruebas/pruebas.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { NoAuthGuard } from './auth/guards/no-auth.guard';
import { SignOutComponent } from './auth/sign-out/sign-out.component';

export const routes: Routes = [
    {path:'pruebas', component: PruebasComponent},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'inicio'},
        
    //ruta para iniciar session
    {
        path:'sign-in',
        canActivate: [NoAuthGuard],//Guard para verificar que no este logueado
        canActivateChild: [NoAuthGuard],
        component: SignInComponent,        
    },

    //ruta para cerrar session
    {
        path:'sign-out',
        canActivate: [AuthGuard],//Guard para verificar que no este logueado
        canActivateChild: [AuthGuard],
        component: SignOutComponent,        
    },

    //ruta para usuarios loguados
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,        
        children: [
            {path: 'inicio', loadChildren: () => import('app/modules/inicio/inicio.routes')},            
        ]  
    }

];
