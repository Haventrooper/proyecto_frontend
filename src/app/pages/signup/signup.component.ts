import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TdserviceService } from 'src/app/services/tdservice.service';
import Swal from 'sweetalert2';
import { AbstractControl, ValidatorFn } from '@angular/forms';

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
      fecha_nacimiento: new FormControl('', [Validators.required, this.edadMinimaValidator(14)])
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
  
  today = new Date();

  edadMinimaValidator(edadMinima: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        const fechaNacimiento = new Date(control.value);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  
        if (edad < edadMinima) {
          return { 'edadMinima': { value: control.value } };
        }
      }
  
      return null;
    };
  }
  validateMaxAge(dateOfBirth: Date): boolean {
    const currentDate = new Date();
    const maxAgeDate = new Date(currentDate.getFullYear() - 150, currentDate.getMonth(), currentDate.getDate());
    return dateOfBirth <= maxAgeDate;
  }

  getAge(fecha_nacimiento: any) {
		var today = new Date();
		var birthDate = new Date(fecha_nacimiento);
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
          Swal.fire(
            'Se ha registrado con exito!',
            '',
            'success'
          )
          this.router.navigate(['/login']);
        },
        (error) => {
          Swal.fire({
          icon: 'error',
          title: 'Verificar información personal',
          text: ''
          })
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Verificar información personal',
        text: ''
        })
    }
  }
  
}
