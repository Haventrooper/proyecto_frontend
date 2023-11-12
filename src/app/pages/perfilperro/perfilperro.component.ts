import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';  // Asegúrate de importar DatePipe correctamente
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-perfilperro',
  templateUrl: './perfilperro.component.html',
  styleUrls: ['./perfilperro.component.scss']
})
export class PerfilperroComponent implements OnInit {

  perro: any;
  actividades: any;
  actividades_recientes: any[] = [];
  formulario: FormGroup;
  generoOptions = [
    { label: 'Macho', value: 'Macho' },
    { label: 'Hembra', value: 'Hembra' }
  ];


  

  constructor(private route: ActivatedRoute, 
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

  }

  razas: SelectItem[] = [];

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
          // Maneja los errores en caso de que ocurra un problema con la eliminación.
          console.error(error);
        }
      );
    }
    else{
      console.error("No se ha encontrado el token en el Local Storage")
    }
   
  }
  eliminarRelacionPerroActividad(idActividad: number) {

    const idPerro = this.perro[0].id_perro;
    const token = localStorage.getItem('token'); /* Obtén el token de autenticación */;

    if (token) {
      this.td_service.eliminarActividadPorPerro(idPerro, idActividad, token).subscribe(
        (response) => {
          // Maneja la respuesta de la API después de la eliminación exitosa.
          console.log(response);
          // Puedes actualizar la vista o realizar otras acciones después de la eliminación.
        },
        (error) => {
          // Maneja los errores en caso de que ocurra un problema con la eliminación.
          console.error(error);
        }
      );
    } else {
      console.error("No se ha encontrado el token en el Local Storage");
    }
  }
}



