import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  perros: any;

  constructor(private td_service: TdserviceService) {}

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
}
