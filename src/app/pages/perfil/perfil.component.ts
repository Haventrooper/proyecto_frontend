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
  perros: any[] = [];
  actividades: any[] = [];



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

  obtenerPerros(): void {
    const token = localStorage.getItem('token');

    if(token){
      this.td_service.getPerros(token).subscribe((data: any) => {
        this.perros = data;
        console.log('Información del perro seleccionado:', this.perros);
        // Aquí puedes asignar los datos a las variables de tu componente
    },
    (error) => {
      console.error('Error al obtener la información de la sugerencia', error);
      // Maneja el error de la solicitud
    });

    }else{
      console.error("Token no encontrado")
    }
  }

  obtenerActividades(): void {
    const token = localStorage.getItem('token');

    if(token){
      this.td_service.getActividades(token).subscribe((data: any) => {
        this.actividades = data;
        console.log('Información de las actividades:', this.actividades);
        // Aquí puedes asignar los datos a las variables de tu componente
    },
    (error) => {
      console.error('Error al obtener las actividades', error);
      // Maneja el error de la solicitud
    });

    }else{
      console.error("Token no encontrado")
    }
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

  //ESTA FUNCION ENVÍA UN ID DE ACTIVIDAD POR EL SERVICIO PARA SER ALMACENADA
  //Esta funcion tiene que mandar desde el html el id de la actividad que guardará uno a uno el id en el servicio
  seleccionarActividad(idActividad: number): void {
    this.td_service.agregarActividadSeleccionada(idActividad);
  }

  crearEntrenamiento(idUsuario: number, idPerro: number, actividadesSeleccionadas: number[]) {
    this.td_service.postEntrenamiento(idUsuario, idPerro, actividadesSeleccionadas).subscribe(
      (response: any) => {
        console.log('Entrenamiento creado con éxito:', response);
        // Realiza acciones adicionales si es necesario
      },
      (error) => {
        console.error('Error al crear el entrenamiento:', error);
        // Maneja errores si es necesario
      }
    );
  }
}
