import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  perros: any;
  username: any;
  actividad: any;
  actividades: any;
  selectedActividad: any;
  displayModal: boolean = false;
  categorias: any;
  pasos: any;

  constructor(private td_service: TdserviceService,
    private router: Router) {}

  ngOnInit(): void {
    this.getNombreUsuario()
    this.obtenerPerros();
    this.obtenerActividades();
    this.obtenerCategorias();
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
}
