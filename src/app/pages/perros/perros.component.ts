import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-perros',
  templateUrl: './perros.component.html',
  styleUrls: ['./perros.component.scss']
})
export class PerrosComponent {

  perros: any;
  registro: FormGroup;
  mostrarModal: boolean = false;
  razas: SelectItem[] = [];
  today = new Date();

  generoOptions = [
    { label: 'Macho', value: 'Macho' },
    { label: 'Hembra', value: 'Hembra' }
  ];

  constructor(private td_service: TdserviceService,
              private fb: FormBuilder,
              private router: Router){

    this.registro = this.fb.group({
      id_raza: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      fecha_nacimiento: new FormControl('', [Validators.required, this.edadMinimaValidator(0)]),
      genero: new FormControl('', [Validators.required]),
    });
    this.obtenerPerros();

    this.obtenerRazas();

  }

  ngOnInit(): void {
  }

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

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  obtenerPerros(): void {
    // Obtener el token del Local Storage
    const token = localStorage.getItem('token');

    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getPerros(token).subscribe((data) => {
        // Asignar la respuesta a la variable perros
        this.perros = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    }
  }

  registrarPerro(){
    const token = localStorage.getItem('token');

    if (token) {
      const datosRegistro = this.registro.value;
      
      this.td_service.postPerro(datosRegistro, token).subscribe(
        (data: any) => {
          console.log('Perro registrado con éxito', data);
          // Realizar cualquier acción adicional después del registro
          Swal.fire({
            title: '¡Registro completado!',
            text: 'El perro se ha registrado con éxito.',
            icon: 'success',
            confirmButtonText: '¡Entendido!'
          });
          location.reload();

  
          // Realizar cualquier acción adicional después del registro
          // Por ejemplo, cerrar el p-dialog
          this.mostrarModal = false;
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Verifica los campos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
  
          // Realizar cualquier acción adicional después del registro
          // Por ejemplo, cerrar el p-dialog
          this.mostrarModal = false;
        }
      );
    } else {
      console.error('Token no encontrado en el localStorage');
      // Manejar la falta de token si es necesario
    }
  }

  obtenerRazas() {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getRazas(token).subscribe(
        (data: any[]) => {
          // Asigna directamente el resultado a la variable razas
          this.razas = data.map(raza => ({ label: raza.nombre, value: raza.id_raza }));
          console.log('Datos de razas cargados:', this.razas);
        },
        error => {
          console.error('Error al obtener las razas:', error);
          // Maneja el error según tus necesidades.
        }
      );
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  seleccionarPerro(perroSeleccionado: any) {
        // Luego, guárdalos en el localStorage
    localStorage.setItem('perroSeleccionado', JSON.stringify(perroSeleccionado));
    this.td_service.actualizarPerroSeleccionado(perroSeleccionado);
    Swal.fire(
      'Se ha seleccionado correctamente!',
      '',
      'success'
    )
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
}
