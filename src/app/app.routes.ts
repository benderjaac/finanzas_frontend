import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { PruebasComponent } from './pruebas/pruebas/pruebas.component';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
    {path:'pruebas', component: PruebasComponent},
    
    //ruta para iniciar session
    {
        path:'sign-in',
        //canActivate: [NoAuthGuard],//Guard para verificar que no este logueado
        //canActivateChild: [NoAuthGuard],
        component: SignInComponent,        
    },

    //ruta inicial
    {
        path: '',
        //canActivate: [AuthGuard],
        //canActivateChild: [AuthGuard],
        component: LayoutComponent,        
        children: [
            {path: 'inicio', loadChildren: () => import('app/modules/inicio/inicio.routes')},
        ]  
    }

];
