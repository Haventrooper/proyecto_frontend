import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { RoutesModule } from './routes/routes.module';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';




import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { HomeComponent } from './pages/home/home.component';
import { PerfilperroComponent } from './pages/perfilperro/perfilperro.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { PerrosComponent } from './pages/perros/perros.component';
import { AdminloginComponent } from './pages/adminlogin/adminlogin.component';
import { AdminComponent } from './pages/admin/admin.component';
import { FileUploadModule } from 'primeng/fileupload';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    PerfilComponent,
    PerfilperroComponent,
    CategoriasComponent,
    PerrosComponent,
    AdminloginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RoutesModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    MenubarModule,
    DialogModule,
    BrowserAnimationsModule,
    CalendarModule,
    DropdownModule,
    InputSwitchModule,
    FileUploadModule,
    InputTextareaModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
