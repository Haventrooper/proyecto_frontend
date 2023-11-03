import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})



export class SignupComponent {

  registro: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router) {
    // Inicializa tu formulario aquí
    this.registro = this.fb.group({
      nombre: ['', Validators.required], // Campo "nombre" con validación requerida
      apellido: ['', [Validators.required, Validators.email]], // Campo "correo" con validación requerida y de correo electrónico
      email: ['', [Validators.required, Validators.email]], // Campo "correo" con validación requerida y de correo electrónico
      contrasena: ['', [Validators.required, Validators.email]], // Campo "correo" con validación requerida y de correo electrónico
      fecha_nacimiento: ['', [Validators.required, Validators.email]], // Campo "correo" con validación requerida y de correo electrónico
      // Agrega más campos según tus necesidades
    });

  }

  ngOnInit(): void {
  }
  
  onSubmit() {
    if (this.registro.valid) {
      // Envía los datos del formulario al servidor o realiza otras acciones aquí
      console.log(this.registro.value);
    }
  }    

}
