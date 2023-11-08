import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-perros',
  templateUrl: './perros.component.html',
  styleUrls: ['./perros.component.scss']
})
export class PerrosComponent {

  perros: any;
  registro: FormGroup;
  mostrarModal: boolean = false;


  constructor(private td_service: TdserviceService,
              private fb: FormBuilder,){

    this.registro = this.fb.group({
      id_raza: ['', Validators.required],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerPerros();
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
        },
        (error) => {
          console.error('Error al registrar el perro', error);
          // Manejar errores si es necesario
        }
      );
    } else {
      console.error('Token no encontrado en el localStorage');
      // Manejar la falta de token si es necesario
    }
  }


  seleccionarPerro(perroSeleccionado: any) {
    this.td_service.actualizarPerroSeleccionado(perroSeleccionado);
  }
}
