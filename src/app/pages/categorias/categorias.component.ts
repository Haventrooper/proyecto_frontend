import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {
  idCategoria: any
  selectedCategoria: any;  // Almacena la categoría seleccionada
  actividades: any[] = [];
  selectedActividad: any;
  displayModal: boolean = false;
  pasos: any;
  pasoActual: number = 0;
  categorias: any[] = [];
  perro: any;
  actividadExistente = false;



  constructor(private route: ActivatedRoute,
              private td_service: TdserviceService) {

              }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idCategoria = +params['idCategoria']; // Convierte el ID a número
      this.obtenerActividadesPorCat(this.idCategoria)
      this.obtenerCategorias();

      const perroSeleccionado = localStorage.getItem('perroSeleccionado');

      // Parsea el JSON si es necesario
      this.perro = perroSeleccionado ? JSON.parse(perroSeleccionado) : null;
      console.log(this.perro.id_perro)
      // Ahora puedes utilizar this.idCategoria para cargar las actividades relacionadas con esta categoría
    });
  }

  obtenerNombreCategoria(idCategoria: number): string {
    const nombreCat = this.categorias?.find((c:any) => c.id_categoria === idCategoria);
    return nombreCat ? nombreCat.nombre : 'Categoría no encontrada';
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

    if (this.perro && this.perro.id_perro) {
      this.guardarActividadPerroReciente()

      this.verificarActividadExistente(token);
      this.cargarPasos(actividad.id_actividad, token);
    } else {
      this.cargarPasos(actividad.id_actividad, token);
      console.log('ID de perro no disponible. No se verificará la actividad pero si los pasos.');
    }
}

guardarActividadPerroReciente() {
  const token = localStorage.getItem('token');

  if (token && this.perro.id_perro !== null) {

    const fecha_reciente = new Date();

    const idPerro = this.perro.id_perro; // Usar el ID del perro seleccionado
    const idActividad = this.selectedActividad.id_actividad; // Reemplaza con el ID de tu actividad

    this.td_service.postActividadPerroReciente(idPerro, idActividad, fecha_reciente, token).subscribe(
      (data: any) => {
        console.log('La actividad reciente se ha guardado correctamente', data);
        // Realiza acciones adicionales después de guardar la actividad
      },
      (error) => {
        console.error('Error al guardar la actividad reciente', error);
        // Maneja errores si es necesario
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
          console.log('La actividad no existe en la BD.');
        }
        console.log("found: ", this.perro.id_perro, this.selectedActividad.id_actividad);
      },
      (error) => {
        console.error('Error al verificar la actividad', error);
        // Maneja errores si es necesario
      }
  );
}

cargarPasos(idActividad: number, token: string) {
  this.td_service.getPasos(idActividad, token).subscribe(
      (data: any) => {
        this.pasos = data; // Cargar los pasos al abrir el diálogo
      },
      (error) => {
        console.error('Error al obtener los pasos de la actividad', error);
        // Maneja errores si es necesario
      }
  );
}
reiniciarValores() {
  // Reinicia las variables y valores que necesites aquí
  this.pasoActual = 0; // Reinicia el paso actual u otro valor predeterminado
  this.pasos = []; // Reinicia los pasos
  this.displayModal = false; // Cierra el modal
  this.selectedActividad = null; // Reinicia la actividad seleccionada
  
    console.log('El diálogo se ha cerrado');
    // Lógica para recargar la página    
  // Otras reinicializaciones según tus necesidades
}

  obtenerActividadesPorCat(idCategoria: number){
    const token = localStorage.getItem('token');
    if (token) {
    this.td_service.getActividadesPorCategoria(idCategoria, token).subscribe(
      (data: any) => {
          this.actividades = data;
          console.log('Actividades por categoria:', this.actividades);
          // Aquí puedes asignar los datos a las variables de tu componente
      },
      (error) => {
        console.error('Error al obtener actividades por categoria', error);
        // Maneja el error de la solicitud
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
  
    // Método para cerrar el diálogo
    cerrarModal() {
      this.displayModal = false;
    }

  obtenerPasos(idActividad: number){
    const token = localStorage.getItem('token');

    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getPasos(idActividad, token).subscribe((data) => {
        // Asignar la respuesta a la variable actividades
        this.pasos = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    } 
  }
  mostrarPasos(idActividad: number) {
    this.obtenerPasos(idActividad);
  }

  obtenerCategorias(){
    const token = localStorage.getItem('token');

    // Verifica que haya un token antes de hacer la llamada al servicio
    if (token) {
      this.td_service.getCategorias(token).subscribe(
        (response: any) => {
          // Maneja la respuesta exitosa, por ejemplo, asignando las categorías a tu variable
          this.categorias = response;
        },
        (error) => {
          // Maneja el error, por ejemplo, mostrando un mensaje al usuario
          console.error('Error al obtener categorías:', error);
        }
      );
    } else {
      // Maneja el caso en que no haya un token disponible
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  } 
  mostrarTodasLasActividades() {
    const token = localStorage.getItem('token');

    if (token) {
      this.selectedCategoria = null; // Reinicia la categoría seleccionada
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
    // Lógica para obtener todas las actividades
    
  }
  siguiente() {
    // Verifica si el paso siguiente es válido
    if (this.pasoActual >= 0 && this.pasoActual < this.pasos.length) {
        console.log(this.pasos[this.pasoActual]);
        this.pasoActual++;
  
        // Verifica si hay un perro seleccionado antes de actualizar el contador
        if (this.perro) {
            const token = localStorage.getItem('token');
  
            if (token) {
                this.actualizarContador(this.perro.id_perro, this.selectedActividad.id_actividad, this.pasoActual, token);
            } else {
                console.error('Token no encontrado en el Local Storage');
            }
        } else {
            console.log('Advertencia: No hay un perro seleccionado. El contador no se actualizará.');
            // Puedes realizar alguna acción o mostrar un mensaje de advertencia según tus necesidades.
        }
    } else {
        console.error('No hay más pasos disponibles o el paso actual es undefined.');
    }
  }
  
  anterior() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
      console.log(this.pasos[this.pasoActual]);
  
      // Verifica si hay un perro seleccionado antes de actualizar el contador
      if (this.perro) {
        const token = localStorage.getItem('token');
        let contadorActual = this.pasoActual; // Asigna el contador después de decrementar
  
        console.log(contadorActual);
  
        if (token) {
          this.actualizarContador(this.perro.id_perro, this.selectedActividad.id_actividad, contadorActual, token);
        } else {
          console.error('Token no encontrado en el Local Storage');
        }
      } else {
        console.log('Advertencia: No hay un perro seleccionado. El contador no se actualizará.');
        // Puedes realizar alguna acción o mostrar un mensaje de advertencia según tus necesidades.
      }
    } else {
      console.error('El paso actual ya es 0, no se puede decrementar más.');
    }
  }
  actualizarContador(idPerro: number, idActividad: number, nuevoContador: number, token: string) {
    this.td_service.putContador(idPerro, idActividad, nuevoContador, token).subscribe(
      (data: any) => {
        console.log('Contador actualizado correctamente', data);
        // Realiza acciones adicionales después de actualizar el contador
      },
      (error) => {
        console.error('Error al actualizar el contador', error);
        // Maneja errores si es necesario
      });
  }

  guardarActividadPerro() {
    const token = localStorage.getItem('token');
  
    if (token && this.perro.id_perro !== null) {

      const contadorActual = this.pasoActual;

      const idPerro = this.perro.id_perro; // Usar el ID del perro seleccionado
      const idActividad = this.selectedActividad.id_actividad; // Reemplaza con el ID de tu actividad
  
      this.td_service.postActividadPerro(idPerro, idActividad, contadorActual, token).subscribe(
        (data: any) => {
          console.log('La actividad se ha guardado correctamente', data);
          // Realiza acciones adicionales después de guardar la actividad
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
          // Maneja errores si es necesario
        });
    } else {
      console.error('Token no encontrado o perro no seleccionado');
    }
  }
}
