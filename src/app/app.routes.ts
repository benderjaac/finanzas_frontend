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
            {path: 'sign-in', loadComponent: () => import('app/auth/sign-in/sign-in.component').then(m => m.SignInComponent)},            
            {path: 'register', loadComponent: () => import('app/auth/register/register.component').then(m => m.RegisterComponent)},            
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
            {path: 'inicio', loadComponent: () => import('app/modules/inicio/inicio.component').then(m => m.InicioComponent)}, 
            {path:'admin', 
                children:[
                    {path: 'users', 
                        children: [
                            {path: 'list', loadComponent: () => import('app/modules/admin/users/users-list/users-list.component').then(m => m.UsersListComponent)},                    
                            {path: 'create', loadComponent: () => import('app/modules/admin/users/users-create/users-create.component').then(m => m.UsersCreateComponent)},                            
                            {path: 'update', loadComponent: () => import('app/modules/admin/users/users-update/users-update.component').then(m => m.UsersUpdateComponent)},                            
                        ]
                    },
                    {path: 'perfil', 
                        children: [
                            {path: 'list', loadComponent: () => import('app/modules/admin/perfil/perfil-list/perfil-list.component').then(m => m.PerfilListComponent)},                    
                            {path: 'create', loadComponent: () => import('app/modules/admin/perfil/perfil-create/perfil-create.component').then(m => m.PerfilCreateComponent)},                            
                            {path: 'update', loadComponent: () => import('app/modules/admin/perfil/perfil-update/perfil-update.component').then(m => m.PerfilUpdateComponent)},                            
                        ]
                    },
                ]
            }, 
            {path:'finanzas', 
                children:[
                    {path: 'gasto', 
                        children: [
                            {path: 'list', loadComponent: () => import('app/modules/finanzas/gasto/gasto-list/gasto-list.component').then(m => m.GastoListComponent)},                    
                            {path: 'create', loadComponent: () => import('app/modules/finanzas/gasto/gasto-create/gasto-create.component').then(m => m.GastoCreateComponent)},                            
                            {path: 'update', loadComponent: () => import('app/modules/finanzas/gasto/gasto-update/gasto-update.component').then(m => m.GastoUpdateComponent)},                            
                        ]
                    },
                    {path: 'ingreso', 
                        children: [
                            {path: 'list', loadComponent: () => import('app/modules/finanzas/ingreso/ingreso-list/ingreso-list.component').then(m => m.IngresoListComponent)},                    
                            {path: 'create', loadComponent: () => import('app/modules/finanzas/ingreso/ingreso-create/ingreso-create.component').then(m => m.IngresoCreateComponent)},                            
                            {path: 'update', loadComponent: () => import('app/modules/finanzas/ingreso/ingreso-update/ingreso-update.component').then(m => m.IngresoUpdateComponent)},                            
                        ]
                    },
                    {path:'resumen', loadComponent: () => import('app/modules/finanzas/resumen/resumen.component').then(m => m.ResumenComponent)}
                ]
            },                       
            {path: '404-not-found', loadComponent: () => import('app/modules/not-found/not-found.component').then(m => m.NotFoundComponent)},            
        ]  
    },

    {path: 'pruebas', pathMatch: 'full', component: PruebasComponent},
    {path: '404-not-found', pathMatch: 'full', component: NotFoundComponent},
    {path: '**', redirectTo: '404-not-found'}

];
