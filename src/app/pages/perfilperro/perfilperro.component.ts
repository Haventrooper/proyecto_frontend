import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';

@Component({
  selector: 'app-perfilperro',
  templateUrl: './perfilperro.component.html',
  styleUrls: ['./perfilperro.component.scss']
})
export class PerfilperroComponent implements OnInit {
  perro: any; // Aquí guardarás los datos del perro

  constructor(private route: ActivatedRoute, private td_service: TdserviceService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const idPerro = params['id_perro'];
      if (idPerro) {
        this.obtenerDatosDelPerro(idPerro);
      } else {
        console.error('idPerro es undefined');
      }
    });
  }

  obtenerDatosDelPerro(idPerro: number) {
    // Supongo que deberías proporcionar un token válido en lugar de "token"
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getPerroPorId(idPerro, token).subscribe((data) => {
        this.perro = data; // Asigna los datos del perro a la variable perro
      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }
}



