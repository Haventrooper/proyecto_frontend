import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormBuilder, FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  registroActividad: FormGroup
  registroPasos: FormGroup
  registroRazas: FormGroup
  registroSugerencias: FormGroup
  razas: SelectItem[] = [];
  razas_: any;
  categorias: SelectItem[] = [];
  actividades: SelectItem[] = [];
  categoriaSeleccionada: any;
  actividades_: any;
  pasos: any
  sugerencias: any;



  constructor( private router: Router,
    private td_service: TdserviceService,
    private fb: FormBuilder){

      this.registroActividad = this.fb.group({
        id_categoria: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),

      });

      this.registroPasos = this.fb.group({
        id_actividad: new FormControl('', [Validators.required]),
        titulo: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),

      });

      this.registroSugerencias = this.fb.group({
        id_raza: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
      });

      this.registroRazas = this.fb.group({
        nombre: new FormControl('', [Validators.required]),
      });
    }

    ngOnInit(): void{
      this.obtenerCategoriasAdmin();
      this.obtenerActividadesAdmin();
      this.obtenerRazasAdmin();
      this.obtenerSugerenciasAdmin();

    }

    postSugerencia(){
      if (this.registroSugerencias.valid) {
        const datosSugerencia = this.registroSugerencias.value;
    
        const token = localStorage.getItem('token');
  
        if(token){
          this.td_service.postSugerenciaAdmin(datosSugerencia, token).subscribe(
            (response) => {
              Swal.fire(
                'Se ha registrado la sugerencia con exito!',
                '',
                'success'
              )
            },
            (error) => {
              console.error('Error al registrar la sugerencia:', error);
              Swal.fire({
                icon: 'error',
                title: 'Verificar información',
                text: 'Hubo un problema al registrar la sugerencia. Por favor, verifica la información e intenta nuevamente.'
              });
            }          
          );
        }else{
          console.log("error")
        }
      }
    }
    postRazaNueva(){
      if (this.registroRazas.valid) {
        const datosRaza = this.registroRazas.value;
    
        const token = localStorage.getItem('token');
  
        if(token){
          this.td_service.postRazaAdmin(datosRaza, token).subscribe(
            (response) => {
              Swal.fire(
                'Se ha registrado la raza con exito!',
                '',
                'success'
              )
            },
            (error) => {
              console.error('Error al registrar la raza:', error);
              Swal.fire({
                icon: 'error',
                title: 'Verificar información',
                text: 'Hubo un problema al registrar la raza. Por favor, verifica la información e intenta nuevamente.'
              });
            }          
          );
        }else{
          console.log("error")
        }
      }
    }

  postActividadNueva(){
    if (this.registroActividad.valid) {
      const datosActividad = this.registroActividad.value;
  
      const token = localStorage.getItem('token');

      if(token){
        this.td_service.adminPostActividad(datosActividad,token).subscribe(
          (response) => {
            Swal.fire(
              'Se ha registrado actividad con exito!',
              '',
              'success'
            )
          },
          (error) => {
            console.error('Error al registrar actividad:', error);
            Swal.fire({
              icon: 'error',
              title: 'Verificar información',
              text: 'Hubo un problema al registrar la actividad. Por favor, verifica la información e intenta nuevamente.'
            });
          }          
        );
      }else{
        console.log("error")
      }
    }
  }
  
  postPasoActividad(){
    if (this.registroPasos.valid) {
      const datosPaso = this.registroPasos.value;
  
      const token = localStorage.getItem('token');

      if(token){
        this.td_service.adminPostPaso(datosPaso, token).subscribe(
          (response) => {
            Swal.fire(
              'Se ha registrado el paso con exito!',
              '',
              'success'
            )
          },
          (error) => {
            console.error('Error al registrar el paso:', error);
            Swal.fire({
              icon: 'error',
              title: 'Verificar información',
              text: 'Hubo un problema al registrar la el paso de la actividad. Por favor, verifica la información e intenta nuevamente.'
            });
          }          
        );
      }else{
        console.log("error")
      }
    }
  }

  obtenerSugerenciasAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getSugerenciasAdmin(token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.sugerencias = response;
        },
        (error) => {
            console.error('Error al obtener sugerencias:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener sugerencias',
              text: 'Hubo un problema al obtener las sugerencias. Por favor, intenta nuevamente.'
            });
          });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }

  obtenerRazasAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getRazasAdmin(token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.razas = response.map((razas: any) => ({ label: razas.nombre, value: razas.id_raza }));
          this.razas_= response
        },
        (error) => {
            console.error('Error al obtener razas:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener razas',
              text: 'Hubo un problema al obtener las razas. Por favor, intenta nuevamente.'
            });
          });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }


  obtenerCategoriasAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getCategoriasAdmin(token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.categorias = response.map((categorias: any) => ({ label: categorias.nombre, value: categorias.id_categoria }));
        },
        (error) => {
            console.error('Error al obtener categorías:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener categorías',
              text: 'Hubo un problema al obtener las categorías. Por favor, intenta nuevamente.'
            });
          });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }

  logoutAdmin(){
    localStorage.removeItem("token")
    localStorage.clear();
    
    Swal.fire({
      title: 'Se ha cerrado la sesión',
      text: 'Se redigirá al login',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      preConfirm: () => {
        return new Promise<void>((resolve) => {
          this.router.navigate(['/adminlogin']).then(() => {
            window.location.reload();
            resolve();
          });
        });
      },
    }).then(() => {
      // Esto se ejecutará después de que se complete la redirección
      console.log('Redirección completada');
    });
  }

  obtenerActividadesAdmin(){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getActividadesAdmin(token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.actividades = response.map((actividades: any) => ({ label: actividades.nombre, value: actividades.id_actividad }));
          this.actividades_ = response      
        },
        (error) => {
            console.error('Error al obtener actividades:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener actividades',
              text: 'Hubo un problema al obtener las actividades. Por favor, intenta nuevamente.'
            });
          });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
  pasosPorActividad: { [idActividad: number]: any[] } = {};

  obtenerPasosPorActividad(idActividad: number){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getPasosActividadesAdmin(idActividad, token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.pasosPorActividad[idActividad] = response;
        },
        (error) => {
            console.error('Error al obtener pasos de actividad:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener pasos de actividad',
              text: 'Hubo un problema al obtener los pasos de actividad. Por favor, intenta nuevamente.'
            });
          });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }

  eliminarActividad(idActividad: number) {
    // Aquí debes implementar la lógica para eliminar la actividad
    // Puedes utilizar tu servicio y sus métodos correspondientes para realizar la eliminación
  
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta actividad?');
  
    if (confirmacion) {
      const token = localStorage.getItem('token');
  
      if (token) {
        this.td_service.deleteActividadYPasos(idActividad, token).subscribe(
          (response) => {
            Swal.fire({
              title: 'Éxito',
              text: 'La actividad y sus pasos han sido eliminados correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            // Puedes realizar otras acciones después de la eliminación, por ejemplo, recargar la lista de actividades
            this.obtenerActividadesAdmin();
          },
          (error) => {
            console.error('Error al eliminar actividad y pasos:', error);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar la actividad y sus pasos',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } else {
        console.error('Token no disponible. El usuario no está autenticado.');
      }
    }
  }

  // En tu archivo de componente TypeScript
  eliminarPaso(idPaso: number) {
    const token = localStorage.getItem('token');

  if (token) {
    // Llama al servicio para eliminar el paso
    this.td_service.eliminarPaso(idPaso, token).subscribe(
      (response) => {
        // Maneja la respuesta exitosa, por ejemplo, muestra un mensaje de éxito
        console.log(response);
        Swal.fire('Éxito', 'El paso ha sido eliminado correctamente', 'success');
        
        // Actualiza la lista de pasos después de la eliminación
        // Puedes llamar a la función para obtener los pasos de la actividad nuevamente
        // Ejemplo: this.obtenerPasosPorActividad(this.idActividadActual);
      },
      (error) => {
        // Maneja el error, por ejemplo, muestra un mensaje de error
        console.error('Error al eliminar el paso:', error);
        Swal.fire('Error', 'Hubo un problema al eliminar el paso. Por favor, intenta nuevamente.', 'error');
      }
    );
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
  
  
}

