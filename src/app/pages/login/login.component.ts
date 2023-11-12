import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';
import { async } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[ TdserviceService ]

})
export class LoginComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private td_service: TdserviceService, 
    private router: Router,


  ) {
    this.form = this.formBuilder.group({
      
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', Validators.required)
    });
  }

  login(){
    this.td_service.login(this.form.get('email')?.value,this.form.get('password')?.value).subscribe(response => {
      let resp: any = response;
      console.log(resp)
      if( resp===false ){
        alert("Verificar credenciales")
      
      } else {
        
        localStorage.setItem("token", resp["token"]);
        alert("Sesión iniciada correctamente")
        console.log("Success")
        this.router.navigate(['/home']);
      }
		})
  }

  paginaRegistro(){
    this.router.navigateByUrl('/signup');
  }
}

