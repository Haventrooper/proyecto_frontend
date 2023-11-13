import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';

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
  categorias: any[] = [];


  constructor(private route: ActivatedRoute,
              private td_service: TdserviceService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idCategoria = +params['idCategoria']; // Convierte el ID a número
      this.obtenerActividadesPorCat(this.idCategoria)
      this.obtenerCategorias();
      // Ahora puedes utilizar this.idCategoria para cargar las actividades relacionadas con esta categoría
    });
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
}
