import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
import { HomeComponent } from '../pages/home/home.component';
import { PerfilComponent } from '../pages/perfil/perfil.component';
import { SignupComponent } from '../pages/signup/signup.component';
import { PerfilperroComponent } from '../pages/perfilperro/perfilperro.component';
import { CategoriasComponent } from '../pages/categorias/categorias.component';
import { PerrosComponent } from '../pages/perros/perros.component';
import { AdminloginComponent } from '../pages/adminlogin/adminlogin.component';
import { AdminComponent } from '../pages/admin/admin.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    RouterModule.forRoot([
      {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login', 
        component: LoginComponent,
      },
      // {
      //   path: '**', 
      //   component: PageNotFoundComponent,
      // },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'perfilperro/:id_perro',
        component: PerfilperroComponent
      },
      { 
        path: 'categorias/:idCategoria',
        component: CategoriasComponent 
      },
      {
        path: 'perros',
        component: PerrosComponent
      },
      {
        path: 'adminlogin',
        component: AdminloginComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      }
    ]),
  ]
})
export class RoutesModule {}
