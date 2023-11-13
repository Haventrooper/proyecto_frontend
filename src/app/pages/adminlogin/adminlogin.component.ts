import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminloginComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private td_service: TdserviceService, 
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required])
    });
  }

  loginAdmin(){
    this.td_service.loginAdmin(this.form.get('email')?.value,this.form.get('password')?.value).subscribe(response => {
      let resp: any = response;
      console.log(resp)
      if( resp===false ){
        
        Swal.fire({
          icon: 'error',
          title: 'Verificar credenciales',
          text: ''
        })
      } else {
        
        localStorage.setItem("token", resp["token"]);
        Swal.fire(
          'Se ha iniciado sesión!',
          '',
          'success'
        )

      }
		})
  }
}
