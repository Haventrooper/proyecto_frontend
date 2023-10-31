import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
import { HomeComponent } from '../pages/home/home.component';


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
      }
    ]),
  ]
})
export class RoutesModule {}
