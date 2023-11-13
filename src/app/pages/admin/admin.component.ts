import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  registroActividad: FormGroup
  categorias: SelectItem[] = [];
  categoriaSeleccionada: any;


  constructor( private router: Router,
    private td_service: TdserviceService,
    private fb: FormBuilder){

      this.registroActividad = this.fb.group({
        id_categoria: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),

      });
    }

    ngOnInit(): void{
      this.obtenerCategoriasAdmin();

    }

  postActividadNueva(){
    
  }

  obtenerCategoriasAdmin() {
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getCategoriasAdmin(token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.categorias = response.map((categorias: any) => ({ label: categorias.nombre, value: categorias.id_categoria }));
        },
        (error) => {
          console.error('Error al obtener categorías:', error);
        }
      );
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }


  logoutAdmin(){
    localStorage.removeItem("token")
    localStorage.clear();
    
    Swal.fire({
      title: 'Se ha cerrado la sesión',
      text: 'Se redigirá al login',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      preConfirm: () => {
        return new Promise<void>((resolve) => {
          this.router.navigate(['/adminlogin']).then(() => {
            window.location.reload();
            resolve();
          });
        });
      },
    }).then(() => {
      // Esto se ejecutará después de que se complete la redirección
      console.log('Redirección completada');
    });
  }
}
