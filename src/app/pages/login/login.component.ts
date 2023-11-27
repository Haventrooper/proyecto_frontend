import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required])
    });
  }

  login() {
    this.td_service.login(this.form.get('email')?.value, this.form.get('password')?.value).subscribe(response => {
      let resp: any = response;
      if (resp.success === false) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'Verifica las credenciales e intenta nuevamente.'
        });
      } else {
        localStorage.setItem("token", resp["token"]);
        Swal.fire({
          icon: 'success',
          title: '¡Se ha iniciado sesión!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/home']);
        });
      }
    });
  }
  

  paginaRegistro(){
    this.router.navigateByUrl('/signup');
  }
}

