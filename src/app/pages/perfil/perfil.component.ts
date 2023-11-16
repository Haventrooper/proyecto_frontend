import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, ValidatorFn } from '@angular/forms';



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
  today = new Date();

  constructor(private td_service: TdserviceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private router: Router){
      this.formulario = this.formBuilder.group({
        nombre: new FormControl('', [Validators.required]),
        apellido: new FormControl( '', [Validators.required]),
        email: new FormControl ('', [Validators.required, Validators.email]),
        fecha_nacimiento: new FormControl ('', [Validators.required, this.edadMinimaValidator(14)])
      });
  }

  ngOnInit(): void{
    this.obtenerUsuario()
    console.log("Se llama los datos de usuario del token")

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

  logout() {
    // Muestra la alerta antes de eliminar los elementos del localStorage
    Swal.fire({
      title: 'Se va a cerrar la sesión',
      text: 'Se redirigirá al login',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica a ejecutar si se hace clic en "Aceptar"
        console.log('Aceptar');
  
        // Elimina elementos del localStorage después de confirmar
        localStorage.removeItem("token");
        localStorage.removeItem("perroSeleccionado");
        localStorage.clear();
  
        // Redirige a la página de login
        this.router.navigate(['/login']); // Asegúrate de cambiar '/login' por la ruta correcta
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Lógica a ejecutar si se hace clic en "Cancelar" o se cierra la alerta
        console.log('Cancelar');
      }
    });
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
        const fechaFormateada = new Date(this.usuario.fecha_nacimiento);
        console.log(this.usuario.fecha_nacimiento)
        console.log(this.usuario.fecha_nacimiento)

        this.formulario = this.formBuilder.group({
          nombre: new FormControl(this.usuario.nombre, [Validators.required]),
          apellido: new FormControl(this.usuario.apellido, [Validators.required]),
          email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
          fecha_nacimiento: new FormControl(fechaFormateada, [Validators.required, this.edadMinimaValidator(14)])
        });
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    }
  }
  validateMaxAge(dateOfBirth: Date): boolean {
    const currentDate = new Date();
    const maxAgeDate = new Date(currentDate.getFullYear() - 150, currentDate.getMonth(), currentDate.getDate());
    return dateOfBirth <= maxAgeDate;
  }

  guardarCambios() {
    const token = localStorage.getItem('token');

    if(token){
      if (this.formulario.valid) {
        const datosActualizados = this.formulario.value;
        
        this.td_service.putModificarUsuario(datosActualizados, token).subscribe(
          (response) => {
            Swal.fire({
              title: '¡Se han actualizado los datos!',
              text: 'Se han modificado los datos con éxito.',
              icon: 'success',
              confirmButtonText: '¡Entendido!'
            });
            location.reload();          
          },
          (error) => {
            Swal.fire({
              title: '¡Error!',
              text: 'Verifica los campos.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
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
