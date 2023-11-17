import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    this.getNombreUsuario()
    this.obtenerPerros();
    this.obtenerActividades();
    this.obtenerCategorias();
    this.obtenerSugerencias();
    this.obtenerRazas();

    const perroSeleccionado = localStorage.getItem('perroSeleccionado');
    
    if (perroSeleccionado) {
        // Si hay datos en el localStorage, convierte la cadena JSON a un objeto y selecciona el perro
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
      this.cargarPasos(actividad.id_actividad, token);
    } else {
      this.cargarPasos(actividad.id_actividad, token);
      console.log('ID de perro no disponible. No se verificará la actividad pero si los pasos.');
    }
}


realizarSolicitudPostActividadReciente(fecha_reciente: Date, token: string) {
    this.td_service.postActividadPerroReciente(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, fecha_reciente, token).subscribe(
        (data: any) => {
          console.log('La actividad reciente se ha guardado correctamente', data);
          // Realiza acciones adicionales después de guardar la actividad
        },
        (error) => {
          console.error('Error al realizar la solicitud POST de actividad reciente', error);
          // Maneja errores si es necesario
        }
    );
}

verificarActividadExistente(token: string) {

  if(!this.perroSeleccionado){
    return
  }
  
  this.td_service.getVerificarActividad(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, token).subscribe(
      (data: any) => {
        if (data.mensaje === 'Actividad ya en BD') {
          this.actividadExistente = true;
        } else if (data.mensaje === 'No hay actividad guardada en BD') {
          console.log('La actividad no existe en la BD.');
        }
        console.log("found: ", this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad);
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
  
siguiente() {
  // Verifica si el paso siguiente es válido
  if (this.pasoActual >= 0 && this.pasoActual < this.pasos.length) {
      console.log(this.pasos[this.pasoActual]);
      this.pasoActual++;

      // Verifica si hay un perro seleccionado antes de actualizar el contador
      if (this.perroSeleccionado) {
          const token = localStorage.getItem('token');

          if (token) {
              this.actualizarContador(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, this.pasoActual, token);
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
    if (this.perroSeleccionado) {
      const token = localStorage.getItem('token');
      let contadorActual = this.pasoActual; // Asigna el contador después de decrementar

      console.log(contadorActual);

      if (token) {
        this.actualizarContador(this.perroSeleccionado.id_perro, this.selectedActividad.id_actividad, contadorActual, token);
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
      console.log('Cancelar');
    }
  });
}


  obtenerPerros(): void {
    // Obtener el token del Local Storage
    const token = localStorage.getItem('token');

    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getPerros(token).subscribe((data) => {
        // Asignar la respuesta a la variable perros
        this.perros = data;
        console.log(this.perros)
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    }
  }
  getNombreUsuario(): void{
    const token = localStorage.getItem('token');

    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getNombreUsuario(token).subscribe((data) => {
        // Asignar la respuesta a la variable nombreusuario
        this.username = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    }  
  }

  obtenerActividades(){
    const token = localStorage.getItem('token');

    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getActividades(token).subscribe((data) => {
        // Asignar la respuesta a la variable actividades
        this.actividades = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
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
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getActividadPorId(idActividad, token).subscribe((data) => {
        // Asignar la respuesta a la variable actividades
        this.actividad = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    } 
  }

  

  obtenerCategorias(){
    const token = localStorage.getItem('token');
    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getCategorias(token).subscribe((data) => {
        // Asignar la respuesta a la variable actividades
        this.categorias = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
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
 

  obtenerPerroPorId(idPerro: number){
    const token = localStorage.getItem('token');
    if (token) {
    this.td_service.getPerroPorId(idPerro, token).subscribe(
      (data: any) => {
          const perroSeleccionado = data[0];
          console.log('Información del perro seleccionado:', perroSeleccionado);
          // Aquí puedes asignar los datos a las variables de tu componente

        // Aquí puedes asignar los datos a las variables de tu componente
        
      },
      (error) => {
        console.error('Error al obtener la información del perro', error);
        // Maneja el error de la solicitud
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
          // Asigna directamente el resultado a la variable razas
          this.razas = data
          console.log('Datos de razas cargados:', this.razas);
        },
        error => {
          console.error('Error al obtener las razas:', error);
          // Maneja el error según tus necesidades.
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
          console.log('Información del perro seleccionado:', this.perroSeleccionado);
  
          // Filtra las sugerencias solo si el perro seleccionado tiene una raza específica diferente de "2"
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
          // Maneja el error de la solicitud
        });
    } else {
      console.error('Token no encontrado');
    }
  }

  verificarActividad(idPerro: number, idActividad: number) {

    const token = localStorage.getItem('token');
    if(token){
    this.td_service.getVerificarActividad(idPerro, idActividad, token).subscribe(
      (data: any) => {
        if (data.mensaje === 'Actividad ya en BD') {
          // La actividad ya está guardada en la base de datos
          // Puedes tomar acciones en consecuencia
        } else if (data.mensaje === 'No hay actividad guardada en BD') {
          // La actividad no está guardada en la base de datos
          // Puedes tomar acciones en consecuencia
        }
      },
      (error) => {
        console.error('Error al verificar la actividad', error);
        // Maneja errores si es necesario
      }
    );
    }else{
      console.error('Token no encontrado');
    }
  }

  seleccionarPerro(perroId: number) {
    this.selectedPerroId = perroId;
  }
  
  verPerfilDelPerro(perroId: number) {
    // Utiliza el enrutador para navegar a la página del perfil del perro
    this.router.navigate(['/perfilperro', perroId]);
  }

  guardarActividadPerro() {
    const token = localStorage.getItem('token');
  
    if (token && this.selectedPerroId !== null) {

      const contadorActual = this.pasoActual;

      const idPerro = this.selectedPerroId; // Usar el ID del perro seleccionado
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

  guardarActividadPerroReciente() {
    const token = localStorage.getItem('token');
  
    if (token && this.selectedPerroId !== null) {

      const fecha_reciente = new Date();

      const idPerro = this.selectedPerroId; // Usar el ID del perro seleccionado
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

  //Modificar
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
}