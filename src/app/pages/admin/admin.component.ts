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
  registroCategorias: FormGroup
  razas: SelectItem[] = [];
  razas_: any;
  categorias: SelectItem[] = [];
  categorias_: any;
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
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),

      });

      this.registroPasos = this.fb.group({
        id_actividad: new FormControl('', [Validators.required]),
        titulo: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
      });

      this.registroSugerencias = this.fb.group({
        id_raza: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
      });

      this.registroRazas = this.fb.group({
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]),
      });

      this.registroCategorias = this.fb.group({
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(40)] ),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
      });
    }

    ngOnInit(): void{
      this.obtenerCategoriasAdmin();
      this.obtenerActividadesAdmin();
      this.obtenerRazasAdmin();
      this.obtenerSugerenciasAdmin();

    }

    postCategorias(){
      if (this.registroCategorias.valid) {
        const datosCategoria = this.registroCategorias.value;
        const token = localStorage.getItem('token');
        if(token){
          this.td_service.postCategoria(datosCategoria, token).subscribe(
            (response) => {
              Swal.fire({
                title: 'Éxito',
                text: 'Se ha registrado la categoría con exito!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerCategoriasAdmin();
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Verificar información',
                text: 'Hubo un problema al registrar la categoría. Por favor, verifica la información e intenta nuevamente.'
              });
            }          
          );
        }else{
          console.log("error")
        }
      }
    }

    postSugerencia(){
      if (this.registroSugerencias.valid) {
        const datosSugerencia = this.registroSugerencias.value;
    
        const token = localStorage.getItem('token');
  
        if(token){
          this.td_service.postSugerenciaAdmin(datosSugerencia, token).subscribe(
            (response) => {
              Swal.fire({
                title: 'Éxito',
                text: 'Se ha registrado la sugerencia con exito!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerSugerenciasAdmin();

            },
            (error) => {
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
              Swal.fire({
                title: 'Éxito',
                text: 'Se ha registrado la raza con exito!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerRazasAdmin();

            },
            (error) => {
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
            Swal.fire({
              title: 'Éxito',
              text: 'Se ha registrado actividad con exito!',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.obtenerActividadesAdmin();

          },
          (error) => {
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
            Swal.fire({
              title: 'Éxito',
              text: 'Se ha registrado el paso con exito!',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          (error) => {
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
          // Mapea las categorías al formato de SelectItem
          this.sugerencias = response;
        },
        (error) => {
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
          // Mapea las categorías al formato de SelectItem
          this.razas = response.map((razas: any) => ({ label: razas.nombre, value: razas.id_raza }));
          this.razas_= response
        },
        (error) => {
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
          // Mapea las categorías al formato de SelectItem
          this.categorias = response.map((categorias: any) => ({ label: categorias.nombre, value: categorias.id_categoria }));
          this.categorias_= response
        },
        (error) => {
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
        localStorage.clear();
  
        // Redirige a la página de login
        this.router.navigate(['/adminlogin']); // Asegúrate de cambiar '/login' por la ruta correcta
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Lógica a ejecutar si se hace clic en "Cancelar" o se cierra la alerta
        console.log('Cancelar');
      }
    });
  }

  obtenerActividadesAdmin(){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getActividadesAdmin(token).subscribe(
        (response: any) => {
          // Mapea las categorías al formato de SelectItem
          this.actividades = response.map((actividades: any) => ({ label: actividades.nombre, value: actividades.id_actividad }));
          this.actividades_ = response      
        },
        (error) => {
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
          // Mapea las categorías al formato de SelectItem
          this.pasosPorActividad[idActividad] = response;
        },
        (error) => {
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
          // El usuario hizo clic en "Aceptar", ahora realizas la eliminación
          this.td_service.deleteActividadYPasos(idActividad, token).subscribe(
            (response) => {
              Swal.fire({
                title: 'Éxito',
                text: 'La acción se realizó con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerActividadesAdmin();
            },
            (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la actividad y sus pasos',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en "Cancelar" o cerró la alerta
          Swal.fire({
            title: 'Cancelado',
            text: 'La acción ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
          // No realizas la eliminación en este caso
        }
      });
    } else {
      console.error("No se encontró token");
    }
  }

  eliminarCategoria(idCat: number) {
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
          // El usuario hizo clic en "Aceptar", ahora realizas la eliminación
          this.td_service.deleteCategoria(idCat, token).subscribe(
            (response) => {
              // Maneja la respuesta exitosa, por ejemplo, muestra un mensaje de éxito
              Swal.fire({
                title: 'Éxito',
                text: 'La categoría ha sido eliminada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerCategoriasAdmin();

              // Puedes realizar otras acciones después de la eliminación si es necesario
            },
            (error) => {
              // Maneja el error, por ejemplo, muestra un mensaje de error
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la categoría. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en "Cancelar" o cerró la alerta
          Swal.fire({
            title: 'Cancelado',
            text: 'La acción ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
          // No realizas la eliminación en este caso
        }
      });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
  

  eliminarPaso(idPaso: number) {
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
          // El usuario hizo clic en "Aceptar", ahora realizas la eliminación
          this.td_service.deletePaso(idPaso, token).subscribe(
            (response) => {
              // Maneja la respuesta exitosa, por ejemplo, muestra un mensaje de éxito
              Swal.fire({
                title: 'Éxito',
                text: 'El paso ha sido eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              // Puedes realizar otras acciones después de la eliminación si es necesario
            },
            (error) => {
              // Maneja el error, por ejemplo, muestra un mensaje de error
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el paso. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en "Cancelar" o cerró la alerta
          Swal.fire({
            title: 'Cancelado',
            text: 'La acción ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
          // No realizas la eliminación en este caso
        }
      });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
  
  
  eliminarSugerencia(idSugerencia: number) {
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
          // El usuario hizo clic en "Aceptar", ahora realizas la eliminación
          this.td_service.deleteSugerencia(idSugerencia, token).subscribe(
            (response) => {
              // Maneja la respuesta exitosa, por ejemplo, muestra un mensaje de éxito
              Swal.fire({
                title: 'Éxito',
                text: 'La sugerencia ha sido eliminada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerSugerenciasAdmin();
              // Puedes realizar otras acciones después de la eliminación si es necesario
            },
            (error) => {
              // Maneja el error, por ejemplo, muestra un mensaje de error
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la sugerencia. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en "Cancelar" o cerró la alerta
          Swal.fire({
            title: 'Cancelado',
            text: 'La acción ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
          // No realizas la eliminación en este caso
        }
      });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
  
  
  eliminarRaza(idRaza: number) {
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
          // El usuario hizo clic en "Aceptar", ahora realizas la eliminación
          this.td_service.deleteRaza(idRaza, token).subscribe(
            (response) => {
              // Maneja la respuesta exitosa, por ejemplo, muestra un mensaje de éxito
              Swal.fire({
                title: 'Éxito',
                text: 'La raza ha sido eliminada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.obtenerRazasAdmin()
              // Puedes realizar otras acciones después de la eliminación si es necesario
            },
            (error) => {
              // Maneja el error, por ejemplo, muestra un mensaje de error
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar la raza. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // El usuario hizo clic en "Cancelar" o cerró la alerta
          Swal.fire({
            title: 'Cancelado',
            text: 'La acción ha sido cancelada',
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
          // No realizas la eliminación en este caso
        }
      });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
}

