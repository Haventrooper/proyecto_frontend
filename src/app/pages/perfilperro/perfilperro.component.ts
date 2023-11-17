import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';  // Asegúrate de importar DatePipe correctamente
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';


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
  id_perro_: any;
  mostrarModal: boolean = false;
  displayModal: boolean = false;
  today = new Date();
  categorias: any


  constructor(private route: ActivatedRoute,
    private router: Router, 
    private td_service: TdserviceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe) {

      this.route.params.subscribe(params => {
      let idPerro = params['id_perro'];
      
      if (idPerro !== undefined && idPerro !== null) {
        this.obtenerDatosDelPerro(idPerro);
        this.obtenerActividadPerro(idPerro);
        this.obtenerActividadPerroRecientes(idPerro);
        this.id_perro_ = idPerro

      } else {
        console.error('idPerro es undefined');
        }
  });
  
  this.formulario = this.formBuilder.group({
    nombre: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.edadMinimaValidator(0)]),
    id_raza: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required])
    });
}

  ngOnInit() {
    this.ordenarActividadesRecientes();
    this.obtenerRazas();
    this.obtenerCategorias();
  }

  obtenerNombreCategoria(idCategoria: number): string {
    const nombreCat = this.categorias?.find((c:any) => c.id_categoria === idCategoria);
    return nombreCat ? nombreCat.nombre : 'Categoría no encontrada';
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
  validateMaxAge(dateOfBirth: Date): boolean {
    const currentDate = new Date();
    const maxAgeDate = new Date(currentDate.getFullYear() - 150, currentDate.getMonth(), currentDate.getDate());
    return dateOfBirth <= maxAgeDate;
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
  
    this.verificarActividadExistente(token);
    this.cargarPasos(actividad.id_actividad, token);

  }


  siguiente() {
    if (this.pasoActual >= 0 && this.pasoActual < this.pasos.length) {
      this.pasoActual++;
      const token = localStorage.getItem('token');

      if (token) {
        this.actualizarContador(this.id_perro_, this.selectedActividad.id_actividad, this.pasoActual, token);

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
      const token = localStorage.getItem('token');
      let contadorActual = this.pasoActual;

      if (token) {
        this.actualizarContador(this.id_perro_, this.selectedActividad.id_actividad, contadorActual, token);
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
      },
      (error) => {
        console.error('Error al actualizar el contador', error);
      });
  }

  verificarActividadExistente(token: string) {
    this.td_service.getVerificarActividad(this.id_perro_, this.selectedActividad.id_actividad, token).subscribe(
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

  obtenerRazas() {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getRazas(token).subscribe(
      (data: any[]) => {
        this.razas = data.map(raza => ({ label: raza.nombre, value: raza.id_raza }));
      },
      error => {
        console.error('Error al obtener las razas:', error);
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
  
      return fechaA.getTime() - fechaB.getTime();
    });
  }

  obtenerDatosDelPerro(idPerro: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getPerroPorId(idPerro, token).subscribe((data) => {
        this.perro = data;  

        const fechaFormateada = new Date(this.perro[0].fecha_nacimiento);

        this.formulario = this.formBuilder.group({
          nombre: new FormControl(this.perro[0].nombre, [Validators.required]),
          fecha_nacimiento: new FormControl(fechaFormateada, [Validators.required, this.edadMinimaValidator(0)]),
          id_raza: new FormControl(this.perro[0].id_raza, [Validators.required]),
          genero: new FormControl(this.perro[0].genero, [Validators.required])
        });
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
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }
  

  modificarPerro() {
    if (this.formulario.valid && this.perro && this.perro.length > 0) {
      const idPerro = this.perro[0].id_perro;
      const datosActualizados = this.formulario.value;
      const token = localStorage.getItem('token');

      if(token){
        this.td_service.putModificarPerro(idPerro, datosActualizados, token).subscribe(
          (response) => {
            Swal.fire({
              title: '¡Se han actualizado los datos!',
              text: 'Se han modificado los datos con éxito.',
              icon: 'success',
              confirmButtonText: '¡Entendido!'
            });
            this.obtenerDatosDelPerro(idPerro)
          },
          (error) => {
            console.error('Error al modificar el perro', error);
            Swal.fire({
              title: '¡Error!',
              text: 'Verifica los campos.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }else{
        console.error('Token no encontrado en el Local Storage');
      }    
    }
  }

  //Delete

  eliminarPerro() {
    const idPerro = this.perro[0].id_perro;
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
          this.td_service.deletePerro(idPerro, token).subscribe(
            (response) => {
              Swal.fire({
                title: 'Éxito',
                text: 'El perro se ha eliminado con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.router.navigate(['/perros']);
            },
            (error) => {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al eliminar el perro. Por favor, intenta nuevamente.',
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
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
  
  eliminarRelacionPerroActividad(event: Event, idActividad: number) {
    event.stopPropagation();
  
    const idPerro = this.perro && this.perro.length > 0 ? this.perro[0].id_perro : null;
    const token = localStorage.getItem('token');
  
    if (token && idPerro) {
      Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción es irreversible',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.td_service.eliminarActividadPorPerro(idPerro, idActividad, token).subscribe(
            (response) => {
              Swal.fire({
                title: 'Actividad eliminada',
                text: 'La actividad se ha eliminado con éxito',
                icon: 'success',
                confirmButtonText: '¡Entendido!'
              });
              this.obtenerActividadPerro(idPerro);
            },
            (error) => {
              console.error(error);
              Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al eliminar la actividad. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: '¡Entendido!'
              });
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



