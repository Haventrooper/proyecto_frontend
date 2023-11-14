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
  registroPasos: FormGroup
  categorias: SelectItem[] = [];
  actividades: SelectItem[] = [];
  categoriaSeleccionada: any;


  constructor( private router: Router,
    private td_service: TdserviceService,
    private fb: FormBuilder){

      this.registroActividad = this.fb.group({
        id_categoria: new FormControl('', [Validators.required]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),

      });

      this.registroPasos = this.fb.group({
        id_actividad: new FormControl('', [Validators.required]),
        titulo: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        nombre: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),

      });
    }

    ngOnInit(): void{
      this.obtenerCategoriasAdmin();
      this.obtenerActividadesAdmin();

    }

  postActividadNueva(){
    if (this.registroActividad.valid) {
      const datosActividad = this.registroActividad.value;
  
      const token = localStorage.getItem('token');

      if(token){
        this.td_service.adminPostActividad(datosActividad,token).subscribe(
          (response) => {
            Swal.fire(
              'Se ha registrado actividad con exito!',
              '',
              'success'
            )
          },
          (error) => {
            console.error('Error al registrar actividad:', error);
            Swal.fire({
              icon: 'error',
              title: 'Verificar información',
              text: 'Hubo un problema al registrar la actividad. Por favor, verifica la información e intenta nuevamente.'
            });
          }          
        );
      }else{
        console.log("error")
      }
    }
  }
  
  postPasoActividad(){
    if (this.registroPasos.valid) {
      const datosPaso = this.registroPasos.value;
  
      const token = localStorage.getItem('token');

      if(token){
        this.td_service.adminPostPaso(datosPaso, token).subscribe(
          (response) => {
            Swal.fire(
              'Se ha registrado el paso con exito!',
              '',
              'success'
            )
          },
          (error) => {
            console.error('Error al registrar el paso:', error);
            Swal.fire({
              icon: 'error',
              title: 'Verificar información',
              text: 'Hubo un problema al registrar la el paso de la actividad. Por favor, verifica la información e intenta nuevamente.'
            });
          }          
        );
      }else{
        console.log("error")
      }
    }
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
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener categorías',
              text: 'Hubo un problema al obtener las categorías. Por favor, intenta nuevamente.'
            });
          });
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

  obtenerActividadesAdmin(){
    const token = localStorage.getItem('token');

    if (token) {
      this.td_service.getActividadesAdmin(token).subscribe(
        (response: any) => {
          console.log(response); // Agrega este console.log para verificar los datos recibidos

          // Mapea las categorías al formato de SelectItem
          this.actividades = response.map((actividades: any) => ({ label: actividades.nombre, value: actividades.id_actividad }));
        },
        (error) => {
            console.error('Error al obtener actividades:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener actividades',
              text: 'Hubo un problema al obtener las actividades. Por favor, intenta nuevamente.'
            });
          });
    } else {
      console.error('Token no disponible. El usuario no está autenticado.');
    }
  }
}
