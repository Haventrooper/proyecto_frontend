import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {
  idCategoria: any
  selectedCategoria: any;
  actividades: any[] = [];
  selectedActividad: any;
  displayModal: boolean = false;
  pasos: any;
  pasoActual: number = 0;
  categorias: any[] = [];
  perros: any;
  perro: any;
  actividadExistente = false;
  perroSeleccionado = localStorage.getItem('perroSeleccionado');


  constructor(private route: ActivatedRoute,
              private td_service: TdserviceService) {

              }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idCategoria = +params['idCategoria'];
      this.obtenerActividadesPorCat(this.idCategoria)
      this.obtenerCategorias();
      this.obtenerPerros();


      const perroSeleccionado = localStorage.getItem('perroSeleccionado');

      this.perro = perroSeleccionado ? JSON.parse(perroSeleccionado) : null;
    });
  }

  obtenerNombreCategoria(idCategoria: number): string {
    const nombreCat = this.categorias?.find((c:any) => c.id_categoria === idCategoria);
    return nombreCat ? nombreCat.nombre : 'Categoría no encontrada';
  }

  abrirDialogo(actividad: any){
    this.displayModal = true;
    this.selectedActividad = actividad;
    this.actividadExistente = false;

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado o inválido en el Local Storage');
      return;
    }

    if (this.perro && this.perro.id_perro) {
      this.guardarActividadPerroReciente()

      this.verificarActividadExistente(token);
      this.cargarPasos(actividad.id_actividad, token);
    } else {
      this.cargarPasos(actividad.id_actividad, token);
      console.log('ID de perro no disponible. No se verificará la actividad pero si los pasos.');
    }
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

guardarActividadPerroReciente() {
  const token = localStorage.getItem('token');

  if (token && this.perro.id_perro !== null) {

    const fecha_reciente = new Date();

    const idPerro = this.perro.id_perro;
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

verificarActividadExistente(token: string) {
  this.td_service.getVerificarActividad(this.perro.id_perro, this.selectedActividad.id_actividad, token).subscribe(
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
reiniciarValores() {
  this.pasoActual = 0;
  this.pasos = [];
  this.displayModal = false;
  this.selectedActividad = null;
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

  obtenerActividadesPorCat(idCategoria: number){
    const token = localStorage.getItem('token');
    if (token) {
    this.td_service.getActividadesPorCategoria(idCategoria, token).subscribe(
      (data: any) => {
          this.actividades = data;
      },
      (error) => {
        console.error('Error al obtener actividades por categoria', error);
      });
    }else{
      console.error('Token no encontrado');
    }
  }
  seleccionarActividad(actividad: any) {
    this.selectedActividad = actividad;
    this.displayModal = true;
  } 

  seleccionarCategoria(categoria: any) {
    const token = localStorage.getItem('token');

    this.selectedCategoria = categoria;
    if (token) {
      this.td_service.getActividadesPorCategoria(categoria.id_categoria, token).subscribe(
        (response: any) => {
          this.actividades = response;
        },
        (error) => {
          console.error('Error al obtener actividades:', error);
        }
      );
    }
    else{
      console.error('Token no encontrado en el Local Storage');
      }
    }
  
    cerrarModal() {
      this.displayModal = false;
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
  mostrarPasos(idActividad: number) {
    this.obtenerPasos(idActividad);
  }

  obtenerCategorias(){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getCategorias(token).subscribe(
        (response: any) => {
          this.categorias = response;
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  } 
  mostrarTodasLasActividades() {
    const token = localStorage.getItem('token');

    if (token) {
      this.selectedCategoria = null;
      this.td_service.getActividades(token).subscribe(
        (response: any) => {
          this.actividades = response;
        },
        (error) => {
          console.error('Error al obtener todas las actividades:', error);
        }
      );
    }else{
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }

  siguiente() {
    if (this.pasoActual >= 0 && this.pasoActual < this.pasos.length) {
        this.pasoActual++;

        if (this.perroSeleccionado) {
            const token = localStorage.getItem('token');

            if (token) {
                this.actualizarContador(this.perro?.id_perro, this.selectedActividad.id_actividad, this.pasoActual, token);
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
  
      const token = localStorage.getItem('token');
        let contadorActual = this.pasoActual; // Asigna el contador después de decrementar
  
        if (token) {
          this.actualizarContador(this.perro?.id_perro, this.selectedActividad.id_actividad, contadorActual, token);
      
        } else {
        console.error('Token no encontrado en el Local Storage');
        }
      } else {
      console.error('El paso actual ya es 0, no se puede decrementar más.');
    }
  }

  actualizarContador(idPerro: number, idActividad: number, nuevoContador: number, token: string) {

    if(!this.perroSeleccionado){
      return
    }
    this.td_service.putContador(idPerro, idActividad, nuevoContador, token).subscribe(
      (data: any) => {
      },
      (error) => {
        console.error('Error al actualizar el contador', error);
      });
  }

  guardarActividadPerro() {
    const token = localStorage.getItem('token');
  
    if (token && this.perro.id_perro !== null) {

      const contadorActual = this.pasoActual;

      const idPerro = this.perro.id_perro;
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
}
