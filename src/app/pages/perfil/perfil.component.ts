import { Component } from '@angular/core';
import { TdserviceService } from 'src/app/services/tdservice.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  usuario: any;


  constructor(private td_service: TdserviceService){

  }

  ngOnInit(): void{
    this.obtenerUsuario()
    console.log("Se llama los datos de usuario del token")


  }

  obtenerUsuario(): void {

    const token = localStorage.getItem('token');
    if (token) {
      // Hacer la solicitud GET utilizando el servicio
      this.td_service.getUsuario(token).subscribe((data) => {
        // Asignar la respuesta a la variable perros
        this.usuario = data;
      });
    } else {
      // Manejar el caso en que no se encuentra un token en el Local Storage
      console.error('Token no encontrado en el Local Storage');
    }
  }
}
