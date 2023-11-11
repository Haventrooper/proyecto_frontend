import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TdserviceService } from 'src/app/services/tdservice.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {

  registro: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private td_service: TdserviceService) 
              {

    this.registro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      contrasena: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  
  registrar() {
    const datosRegistro = this.registro.value;
  
    this.td_service.signUp(datosRegistro).subscribe(
      (response) => {
        console.log('Usuario registrado con éxito', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al registrar el usuario', error);
        alert("Error de registro, verifica credenciales");
      }
    );
  }
}
