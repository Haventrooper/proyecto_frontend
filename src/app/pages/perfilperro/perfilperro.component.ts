import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';  // Asegúrate de importar DatePipe correctamente
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfilperro',
  templateUrl: './perfilperro.component.html',
  styleUrls: ['./perfilperro.component.scss']
})
export class PerfilperroComponent implements OnInit {

  razas: SelectItem[] = [];
  perro: any;
  actividades: any;
  actividades_recientes: any[] = [];
  formulario: FormGroup;
  generoOptions = [
    { label: 'Macho', value: 'Macho' },
    { label: 'Hembra', value: 'Hembra' }
  ];
  selectedActividad: any;
  pasos: any;
  pasoActual: number = 0;
  actividadExistente = false;
  idP: any;
  mostrarModal: boolean = false;
  displayModal: boolean = false;


  constructor(private route: ActivatedRoute,
    private router: Router, 
    private td_service: TdserviceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) {

      this.route.params.subscribe(params => {
      let idPerro = params['id_perro'];
      
      if (idPerro !== undefined && idPerro !== null) {
        // El parámetro 'id_perro' tiene un valor válido, puedes proceder
        this.obtenerDatosDelPerro(idPerro);
        this.obtenerActividadPerro(idPerro);
        this.obtenerActividadPerroRecientes(idPerro);
        console.log(idPerro)
        this.idP = idPerro
        console.log(this.idP)

      } else {
        console.error('idPerro es undefined');
        }
  });

  this.formulario = this.formBuilder.group({
  nombre: ['', Validators.required],
  fecha_nacimiento: ['', Validators.required],
  id_raza: ['', [Validators.required]],
  genero: ['', Validators.required]
  });
}

  ngOnInit() {
    this.ordenarActividadesRecientes();
    this.obtenerRazas();
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      id_raza: ['', [Validators.required]],
      genero: ['', Validators.required]
      });
  }

  
  abrirModal() {
    this.mostrarModal = true;
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
  
    this.verificarActividadExistente(token);
    this.cargarPasos(actividad.id_actividad, token);
  }

  recargarPagina() {
    location.reload();
  }

  

  siguiente() {
    // Verifica si el paso siguiente es válido
    if (this.pasoActual >= 0 && this.pasoActual < this.pasos.length) {
      console.log(this.pasos[this.pasoActual]);
      this.pasoActual++;
      const token = localStorage.getItem('token');

      if (token) {
        this.actualizarContador(this.idP, this.selectedActividad.id_actividad, this.pasoActual, token);
      } else {
        console.error('Token no encontrado en el Local Storage');
      }
    } else {
      console.error('No hay más pasos disponibles o el paso actual es undefined.');
    }
    
    
  }

  anterior() {
    if (this.pasoActual > 0) {
      this.pasoActual--;
      console.log(this.pasos[this.pasoActual]);
      const token = localStorage.getItem('token');
      let contadorActual = this.pasoActual; // Asigna el contador después de decrementar

      console.log(contadorActual)

      if (token) {
        this.actualizarContador(this.idP, this.selectedActividad.id_actividad, contadorActual, token);
    
      } else {
      console.error('Token no encontrado en el Local Storage');
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

  verificarActividadExistente(token: string) {
    this.td_service.getVerificarActividad(this.idP, this.selectedActividad.id_actividad, token).subscribe(
        (data: any) => {
          if (data.mensaje === 'Actividad ya en BD') {
            this.actividadExistente = true;
          } else if (data.mensaje === 'No hay actividad guardada en BD') {
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
obtenerRazas() {
  const token = localStorage.getItem('token');
  if (token) {
    this.td_service.getRazas(token).subscribe(
      (data: any[]) => {
        // Asigna directamente el resultado a la variable razas
        this.razas = data.map(raza => ({ label: raza.nombre, value: raza.id_raza }));
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

  ordenarActividadesRecientes() {
    this.actividades_recientes.sort((a: any, b: any) => {
      const fechaA = new Date(a.fecha_reciente);
      const fechaB = new Date(b.fecha_reciente);
  
      // Ordenar de más antiguo a más reciente
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  obtenerDatosDelPerro(idPerro: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getPerroPorId(idPerro, token).subscribe((data) => {
        this.perro = data;
        console.log('Datos del perro cargados:', this.perro);
  
        // Mueve aquí cualquier código que dependa de this.perro
        // Por ejemplo, puedes llamar a otras funciones que utilicen this.perro aquí
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }
  

  obtenerActividadPerro(idPerro: number): void{
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getActividadesPerro(idPerro, token).subscribe((data) => {
        this.actividades = data;
        console.log('Datos del perro cargados:', this.actividades);
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  obtenerActividadPerroRecientes(idPerro: number): void{
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getActividadesPerroRecientes(idPerro, token).subscribe((data: any) => {
        this.actividades_recientes = data;
        console.log('Datos de la actividad reciente del perro cargados:', this.actividades_recientes);
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }
  

  modificarPerro() {
    if (this.formulario.valid && this.perro && this.perro.length > 0) {
      const idPerro = this.perro[0].id_perro;
      const datosActualizados = this.formulario.value;
      const token = localStorage.getItem('token');/* Obtén el token de autenticación */;
      datosActualizados.fecha_nacimiento = this.datePipe.transform(datosActualizados.fecha_nacimiento, 'yyyy-MM-dd');

      if(token){
        this.td_service.putModificarPerro(idPerro, datosActualizados, token).subscribe(
          (response) => {
            console.log('El perro se ha modificado correctamente', response);
            // Realiza acciones adicionales después de la modificación
          },
          (error) => {
            console.error('Error al modificar el perro', error);
            // Maneja errores si es necesario
          }
        );
      }else{
        console.error('Token no encontrado en el Local Storage');
      }    
    }
  }

  //Delete

  eliminarPerro() {
    const idPerro = this.perro[0].id_perro
    const token = localStorage.getItem('token');/* Obtén el token de autenticación */;

    if(token){
      this.td_service.deletePerro(idPerro, token).subscribe(
        (response) => {
          

          // Maneja la respuesta de la API después de la eliminación exitosa.
          console.log(response);
          // Puedes actualizar la vista o realizar otras acciones después de la eliminación.
        },
        (error) => {
          Swal.fire({
            title: 'Se ha eliminado el perro',
            text: 'El perro se ha eliminado con exito',
            icon: 'success',
            confirmButtonText: '¡Entendido!'
          });
          this.router.navigate(['/perros']);
          // Maneja los errores en caso de que ocurra un problema con la eliminación.
          console.error(error);
        }
      );
    }
    else{
      console.error("No se ha encontrado el token en el Local Storage")
    }
   
  }
  eliminarRelacionPerroActividad(event: Event, idActividad: number) {
    event.stopPropagation();
  
    const idPerro = this.perro && this.perro.length > 0 ? this.perro[0].id_perro : null;
    const token = localStorage.getItem('token'); /* Obtén el token de autenticación */;
  
    if (token && idPerro) {
      this.td_service.eliminarActividadPorPerro(idPerro, idActividad, token).subscribe(
        (response) => {
          // Maneja la respuesta de la API después de la eliminación exitosa.
          console.log(response);
          
          // Muestra el Swal alert después de la eliminación exitosa.
          Swal.fire({
            title: 'Actividad eliminada',
            text: 'La actividad se ha eliminado con éxito',
            icon: 'success',
            confirmButtonText: '¡Entendido!'
          });
  
          // Puedes actualizar la vista o realizar otras acciones después de la eliminación.
        },
        (error) => {
          // Maneja los errores en caso de que ocurra un problema con la eliminación.
          console.error(error);
  
          // Muestra un Swal alert indicando el error.
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al eliminar la actividad',
            icon: 'error',
            confirmButtonText: '¡Entendido!'
          });
        }
      );
    } else {
      console.error("No se ha encontrado el token o el ID del perro en el Local Storage");
    }
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



