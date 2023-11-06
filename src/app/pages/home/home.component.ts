import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @Input() perroSeleccionado: any;
  perroSeleccionadoId: any;

  
  perros: any;
  perro: any;
  username: any;
  actividad: any;
  actividades: any;
  selectedActividad: any;
  displayModal: boolean = false;
  categorias: any;
  pasos: any;
  sugerencias: any;

  constructor(private td_service: TdserviceService,
    private router: Router) {
    }

  ngOnInit(): void {
    this.getNombreUsuario()
    this.obtenerPerros();
    this.obtenerActividades();
    this.obtenerCategorias();
    this.obtenerSugerencias();

  }

  logout(){
    localStorage.removeItem("token")
    alert("La sesión ha caducado")
    this.router.navigate(['/login']);
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

  seleccionarActividad(actividad: any) {
    this.selectedActividad = actividad;
    this.displayModal = true;
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

  obtenerPerroPorId(idPerro: number){
    const token = localStorage.getItem('token');
    if (token) {
    this.td_service.getPerroPorId(idPerro, token).subscribe(
      (data: any) => {
          const perroSeleccionado = data[0];
          console.log('Información del perro seleccionado:', perroSeleccionado);
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
  
  obtenerSugerencias(){
    const token = localStorage.getItem('token');
    if(token){
    this.td_service.getSugerencias(token).subscribe(
      (data: any) => {
          this.sugerencias = data;
          console.log('Información del perro seleccionado:', this.sugerencias);
          // Aquí puedes asignar los datos a las variables de tu componente
      },
      (error) => {
        console.error('Error al obtener la información de la sugerencia', error);
        // Maneja el error de la solicitud
      });
    }else{
      console.error('Token no encontrado');
    }
  }

  selectedPerroId: number | null = null;

  seleccionarPerro(perroId: number) {
    this.selectedPerroId = perroId;
  }
  
  //REQUIERE DE ATENCION PROBLEMA DE TOKEN 401
  guardarActividadPerro() {
    const token = localStorage.getItem('token');
  
    if (token && this.selectedPerroId !== null) {
      const idPerro = this.selectedPerroId; // Usar el ID del perro seleccionado
      const idActividad = this.selectedActividad.id_actividad; // Reemplaza con el ID de tu actividad
  
      this.td_service.postActividadPerro(idPerro, idActividad, token).subscribe(
        (data: any) => {
          console.log('La actividad se ha guardado correctamente', data);
          // Realiza acciones adicionales después de guardar la actividad
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