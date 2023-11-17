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
    Swal.fire({
      title: 'Se va a cerrar la sesión',
      text: 'Se redirigirá al login',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }
        if (localStorage.getItem("perroSeleccionado")) {
          localStorage.removeItem("perroSeleccionado");
        }
        localStorage.clear();
        this.td_service.actualizarPerroSeleccionado(null);
        this.router.navigate(['/login']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  
  obtenerPerros(): void {
    const token = localStorage.getItem('token');

    if(token){
      this.td_service.getPerros(token).subscribe((data: any) => {
        this.perros = data;
    },
    (error) => {
      console.error('Error al obtener la información de la sugerencia', error);
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
    },
    (error) => {
      console.error('Error al obtener las actividades', error);
    });

    }else{
      console.error("Token no encontrado")
    }
  }


  obtenerUsuario(): void {

    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getUsuario(token).subscribe((data) => {
        this.usuario = data;
        const fechaFormateada = new Date(this.usuario.fecha_nacimiento);

        this.formulario = this.formBuilder.group({
          nombre: new FormControl(this.usuario.nombre, [Validators.required]),
          apellido: new FormControl(this.usuario.apellido, [Validators.required]),
          email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
          fecha_nacimiento: new FormControl(fechaFormateada, [Validators.required, this.edadMinimaValidator(14)])
        });
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  eliminarUsuario() {
    const token = localStorage.getItem('token');

    if (token) {
      
      Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción es irreversible',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {
        this.td_service.deleteUsuario(this.usuario.id_usuario, token).subscribe(
          (response) => {
            Swal.fire({
              title: 'Éxito',
              text: 'El usuario se ha eliminado con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            localStorage.removeItem("token");
            localStorage.removeItem("perroSeleccionado");
            localStorage.clear();
            this.td_service.actualizarPerroSeleccionado(null);

            this.router.navigate(['/login']);
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar usuario. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.error(error);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          text: 'La acción ha sido cancelada',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
        }
      });
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
          }
        );
      }
    }
  }

  seleccionarActividad(idActividad: number): void {
    this.td_service.agregarActividadSeleccionada(idActividad);
  }

  crearEntrenamiento(idUsuario: number, idPerro: number, actividadesSeleccionadas: number[]) {
    this.td_service.postEntrenamiento(idUsuario, idPerro, actividadesSeleccionadas).subscribe(
      (response: any) => {
      },
      (error) => {
        console.error('Error al crear el entrenamiento:', error);
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
