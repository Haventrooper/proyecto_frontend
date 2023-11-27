import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
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

                this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    window.scrollTo(0, 0);
                  }
                });

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

  todosPerrosDeshabilitados(): boolean {
    return this.perros && this.perros.every((perro: { deshabilitado: boolean | null }) => (perro.deshabilitado === null || perro.deshabilitado === false));
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
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getPerros(token).subscribe((data) => {
        this.perros = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  registrarPerro(){
    const token = localStorage.getItem('token');

    if (this.registro.valid) {


    if (token) {
      const datosRegistro = this.registro.value;
      
      this.td_service.postPerro(datosRegistro, token).subscribe(
        (data: any) => {
          Swal.fire({
            title: '¡Registro completado!',
            text: 'El perro se ha registrado con éxito.',
            icon: 'success',
            timer: 1500,
            confirmButtonText: '¡Entendido!'
          });
          this.obtenerPerros()
          this.registro = this.fb.group({
            id_raza: new FormControl('', [Validators.required]),
            nombre: new FormControl('', [Validators.required]),
            fecha_nacimiento: new FormControl('', [Validators.required, this.edadMinimaValidator(0)]),
            genero: new FormControl('', [Validators.required]),
          });
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Verifica los campos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      console.error('Token no encontrado en el localStorage');
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Verificar información de perro',
      text: ''
      })
  }
  }

  obtenerRazas() {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getRazas(token).subscribe(
        (data: any[]) => {
          this.razas = data.map(raza => ({ label: raza.nombre, value: raza.id_raza }));
          this.razas.sort((a: any, b: any) => a.label.localeCompare(b.label));
        },
        error => {
          console.error('Error al obtener las razas:', error);
        }
      );
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  seleccionarPerro(perroSeleccionado: any) {
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
