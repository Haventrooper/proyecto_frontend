import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  usuario: any;
  formulario: FormGroup;


  constructor(private td_service: TdserviceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe){
      this.formulario = this.formBuilder.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        fecha_nacimiento: ['', Validators.required]
      });

  }

  ngOnInit(): void{
    this.obtenerUsuario()
    console.log("Se llama los datos de usuario del token")


  }

  obtenerUsuario(): void {

    const token = localStorage.getItem('token');
    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getUsuario(token).subscribe((data) => {
        // Asignar la respuesta a la variable perros
        this.usuario = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    }
  }

  guardarCambios() {
    const token = localStorage.getItem('token');

    if(token){
      if (this.formulario.valid) {
        const datosActualizados = this.formulario.value;
        datosActualizados.fecha_nacimiento = this.datePipe.transform(datosActualizados.fecha_nacimiento, 'yyyy-MM-dd');

        
        this.td_service.putModificarUsuario(datosActualizados, token).subscribe(
          (response) => {
            console.log('Datos de usuario actualizados con éxito', response);
            // Realiza acciones adicionales después de la actualización
          },
          (error) => {
            console.error('Error al actualizar los datos de usuario', error);
            // Maneja errores si es necesario
          }
        );
      }
    }
  }
}
