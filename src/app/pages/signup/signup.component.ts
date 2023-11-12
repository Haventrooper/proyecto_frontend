import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
      nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
      apellido: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      contrasenaRep: new FormControl({value: '', disabled: true}, [Validators.required, Validators.minLength(3), Validators.maxLength(15),this.confirmPasswordValidator.bind(this)]),
      fecha_nacimiento: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.registro.get('contrasena')?.valueChanges.subscribe(
      (valorCampo) => {
        if (this.registro.get('contrasena')?.valid) {
          this.registro.get('contrasenaRep')?.enable();
        } else {
          this.registro.get('contrasenaRep')?.disable();
        }
  
        if (valorCampo !== this.registro.get('contrasenaRep')?.value) {
          this.registro.setErrors({ 'passwordMismatch': true });
        } else {
          this.registro.setErrors(null);
        }
      });
  }
  
  

  getAge(fechaNacimiento: any) {
		var today = new Date();
		var birthDate = new Date(fechaNacimiento);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

  confirmPasswordValidator(control: FormControl): { [key: string]: any } | null {
    const password = this.registro?.get('contrasena')?.value;
    const contraseñaRep = control.value;
  
    return password === contraseñaRep ? null : { 'passwordMismatch': true };
  }
  


  
  registrar() {
    if (this.registro.valid) {
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
    } else {
      console.log('Formulario inválido. Por favor, verifica los campos.');
    }
  }
  
}
