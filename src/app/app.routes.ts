import { Routes } from '@angular/router';
import { PruebasComponent } from './pruebas/pruebas/pruebas.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { NoAuthGuard } from './auth/guards/no-auth.guard';
import { SignOutComponent } from './auth/sign-out/sign-out.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { EmptyComponent } from './layout/empty/empty.component';

export const routes: Routes = [
    {path:'pruebas', component: PruebasComponent},
    {path:'', pathMatch : 'full', redirectTo: 'inicio'},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'inicio'},
        
    //ruta para iniciar session
    {
        path:'',
        canActivate: [NoAuthGuard],//Guard para verificar que no este logueado
        canActivateChild: [NoAuthGuard],
        component: EmptyComponent,
        children: [
            {path: 'sign-in', loadChildren: () => import('app/auth/sign-in/sign-in.routes')},            
            {path: 'register', loadChildren: () => import('app/auth/register/register.routes')},            
        ]         
    },   

    //ruta para cerrar session
    {
        path:'sign-out',
        canActivate: [AuthGuard],//Guard para verificar que este logueado
        canActivateChild: [AuthGuard],
        component: SignOutComponent,        
    },

    //ruta para usuarios logueados
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,        
        children: [
            {path: 'inicio', loadChildren: () => import('app/modules/inicio/inicio.routes')},            
        ]  
    },

    {path: '404-not-found', pathMatch: 'full', component: NotFoundComponent},
    {path: '**', redirectTo: '404-not-found'}

];
