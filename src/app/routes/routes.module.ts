import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';



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
        component: LoginComponent
      },
      {
        path: '**', 
        component: PageNotFoundComponent
      },
    ]),
  ]
})
export class RoutesModule {}
