import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  perros: any;
  perro: any;
  username: any;
  actividad: any;
  actividades: any;
  selectedActividad: any;
  displayModal: boolean = false;
  categorias: any;
  pasos: any;
  pasoActual: number = 0;
  sugerencias: any;
  actividadExistente = false;
  razas: any;

    
  selectedPerroId: number | null = null;
  perroSeleccionado: any = null;

  constructor(private td_service: TdserviceService,
    private router: Router) {

      this.td_service.perroSeleccionado$.subscribe((perro) => {
        this.perroSeleccionado = perro;
      });
      this.pasos = [];
    }

  ngOnInit(): void {
    this.getNombreUsuario();
    this.obtenerPerros();
    this.obtenerActividades();
    this.obtenerCategorias();
    this.obtenerSugerencias();
    this.obtenerRazas();


    const perroSeleccionado = localStorage.getItem('perroSeleccionado');
    
    if (perroSeleccionado) {
        this.perroSeleccionado = JSON.parse(perroSeleccionado);
        this.seleccionarPerro(this.perroSeleccionado.id_perro);
    }

  }

  ngOnDestroy() {
    this.reiniciarValores();
  }

  abrirDialogo(actividad: any){
    this.displayModal = true;
    this.selectedActividad = actividad;
    this.actividadExistente = false; // Establece inicialmente en false

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado o inválido en el Local Storage');
      return;
    }

    if (this.perroSeleccionado && this.perroSeleccionado.id_perro) {
      this.guardarActividadPerroReciente()      
      this.verificarActividadExistente(token);

      this.cargarPasos(actividad.id_actividad, token);
    } else {
      this.cargarPasos(actividad.id_actividad, token);
    }
}


realizarSolicitudPostActividadReciente(fecha_reciente: Date, token: string) {
    this.td_service.postActividadPerroReciente(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, fecha_reciente, token).subscribe(
        (data: any) => {
        },
        (error) => {
          console.error('Error al realizar la solicitud POST de actividad reciente', error);
        }
    );
}

verificarActividadExistente(token: string) {

  this.td_service.getVerificarActividad(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, token).subscribe(
      (data: any) => {
        if (data.mensaje === 'Actividad ya en BD') {
          this.actividadExistente = true;
        } else if (data.mensaje === 'No hay actividad guardada en BD') {
        }
      },
      (error) => {
        console.error('Error al verificar la actividad', error);
      }
  );
}


cargarPasos(idActividad: number, token: string) {
    this.td_service.getPasos(idActividad, token).subscribe(
        (data: any) => {
          this.pasos = data;
        },
        (error) => {
          console.error('Error al obtener los pasos de la actividad', error);
        }
    );
}
  
siguiente() {
  if (this.pasoActual >= 0 && this.pasoActual < this.pasos.length) {
      this.pasoActual++;

      if (this.perroSeleccionado) {
          const token = localStorage.getItem('token');

          if (token) {
              this.actualizarContador(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, this.pasoActual, token);
          } else {
              console.error('Token no encontrado en el Local Storage');
          }
      } else {
      }
  } else {
      console.error('No hay más pasos disponibles o el paso actual es undefined.');
  }
}
anterior() {
  if (this.pasoActual > 0) {
    this.pasoActual--;

    if (this.perroSeleccionado) {
      const token = localStorage.getItem('token');
      let contadorActual = this.pasoActual;

      if (token) {
        this.actualizarContador(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, contadorActual, token);
      } else {
        console.error('Token no encontrado en el Local Storage');
      }
      } else {
    }
  } else {
    console.error('El paso actual ya es 0, no se puede decrementar más.');
  }
}

  reiniciarValores() {
    this.pasoActual = 0;
    this.pasos = [];
    this.displayModal = false;
    this.selectedActividad = null;
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

    if (token) {
      this.td_service.getPerros(token).subscribe((data) => {
        this.perros = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
    }
  
  getNombreUsuario(): void{
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getNombreUsuario(token).subscribe((data) => {
        this.username = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }  
  }

  obtenerActividades(){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getActividades(token).subscribe((data) => {
        this.actividades = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    } 
  }

  perfilUsuario(){
    this.router.navigateByUrl('/perfil');
  }

  obtenerActividad(idActividad: number){
    this.pasoActual = 0;
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getActividadPorId(idActividad, token).subscribe((data) => {
        this.actividad = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    } 
  }

  obtenerCategorias(){
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getCategorias(token).subscribe((data) => {
        this.categorias = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }   
  }

  obtenerNombreCategoria(idCategoria: number): string {
    const nombreCat = this.categorias?.find((c:any) => c.id_categoria === idCategoria);
    return nombreCat ? nombreCat.nombre : 'Categoría no encontrada';
  }

  obtenerPasos(idActividad: number){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getPasos(idActividad, token).subscribe((data) => {
        this.pasos = data;
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    } 
  }
 

  obtenerPerroPorId(idPerro: number){
    const token = localStorage.getItem('token');
    if (token) {
    this.td_service.getPerroPorId(idPerro, token).subscribe(
      (data: any) => {
          const perroSeleccionado = data[0];
      },
      (error) => {
        console.error('Error al obtener la información del perro', error);
      });
    }else{
      console.error('Token no encontrado');
    }
  }
  
  obtenerRazas() {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getRazas(token).subscribe(
        (data: any) => {
          this.razas = data
        },
        error => {
          console.error('Error al obtener las razas:', error);
        }
      );
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  obtenerSugerencias() {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getSugerencias(token).subscribe(
        (data: any) => {
          this.sugerencias = data;
          if(!this.perroSeleccionado){
            return
          }
          if (this.perroSeleccionado.id_raza !== 2) {
            this.sugerencias = this.sugerencias.filter((sugerencia: any) =>
              sugerencia.id_raza === this.perroSeleccionado.id_raza
            );
          }
        },
        (error) => {
          console.error('Error al obtener la información de la sugerencia', error);
        });
    } else {
      console.error('Token no encontrado');
    }
  }


  seleccionarPerro(perroId: number) {
    this.selectedPerroId = perroId;
  }
  
  verPerfilDelPerro(perroId: number) {
    this.router.navigate(['/perfilperro', perroId]);
  }

  
  guardarActividadPerros() {
    const cantidadPerros = this.perros?.length;
    const idActividad = this.selectedActividad?.id_actividad;
    const contadorActual = this.pasoActual;
  
    const token = localStorage.getItem('token');
    
    if (token) {
      const observables = [];
  
      for (var i = 0; i < cantidadPerros; i++) {
        console.log(this.perros[i]?.id_perro);

        if(this.perros[i]?.deshabilitado!=true){
          const observable = this.td_service.postActividadPerro(this.perros[i]?.id_perro, idActividad, contadorActual, token);
          observables.push(observable);
        }
        else{
          continue
        }
  
      }
  
      forkJoin(observables).subscribe(
        (data: any[]) => {
          // Este bloque se ejecutará cuando todas las solicitudes se completen con éxito
          console.log('Todas las solicitudes se completaron con éxito', data);
  
          // Muestra el Swal aquí después de que todas las solicitudes se completen
          Swal.fire({
            title: 'Actividad guardada en perros exitosamente',
            text: 'Actividad guardada en perros correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
  
          // Oculta el modal después de que todas las solicitudes se completen
          this.displayModal = false;
        },
        (error) => {
          // Este bloque se ejecutará si al menos una de las solicitudes falla
          Swal.fire({
            title: 'Actividades ya guardadas',
            text: 'Las actividades ya están guardadas',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });     
          this.displayModal = false;   
        }
      );
    } else {
      console.error("No se encontró token");
    }
  }

  verificarActividad(idPerro: number, idActividad: number) {

    const token = localStorage.getItem('token');
    if(token){
    this.td_service.getVerificarActividad(idPerro, idActividad, token).subscribe(
      (data: any) => {
        if (data.mensaje === 'Actividad ya en BD') {
        } 
        else if (data.mensaje === 'No hay actividad guardada en BD') {
        }
      },
      (error) => {
        console.error('Error al verificar la actividad', error);
      }
    );
    }else{
      console.error('Token no encontrado');
    }
  }

  guardarActividadPerro() {
    const token = localStorage.getItem('token');
  
    if (token && this.selectedPerroId !== null) {

      const contadorActual = this.pasoActual;

      const idPerro = this.selectedPerroId;
      const idActividad = this.selectedActividad.id_actividad;
  
      this.td_service.postActividadPerro(idPerro, idActividad, contadorActual, token).subscribe(
        (data: any) => {
          this.displayModal = false
          Swal.fire({
            title: 'Actividad guardada',
            text: 'Actividad guardada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        },
        (error) => {
          console.error('Error al guardar la actividad', error);
        });
    } else {
      console.error('Token no encontrado o perro no seleccionado');
    }
  }

  guardarActividadPerroReciente() {
    const token = localStorage.getItem('token');
  
    if (token && this.selectedPerroId !== null) {

      const fecha_reciente = new Date();

      const idPerro = this.selectedPerroId;
      const idActividad = this.selectedActividad.id_actividad;
  
      this.td_service.postActividadPerroReciente(idPerro, idActividad, fecha_reciente, token).subscribe(
        (data: any) => {
        },
        (error) => {
          console.error('Error al guardar la actividad reciente', error);
        });
    } else {
      console.error('Token no encontrado o perro no seleccionado');
    }
  }

  //Modificar
  actualizarContador(idPerro: number, idActividad: number, nuevoContador: number, token: string) {
    this.td_service.putContador(idPerro, idActividad, nuevoContador, token).subscribe(
      (data: any) => {
      },
      (error) => {
        console.error('Error al actualizar el contador', error);
      });
  }
}