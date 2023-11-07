import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';  // Asegúrate de importar DatePipe correctamente

@Component({
  selector: 'app-perfilperro',
  templateUrl: './perfilperro.component.html',
  styleUrls: ['./perfilperro.component.scss']
})
export class PerfilperroComponent implements OnInit {

  perro: any; // Aquí guardarás los datos del perro
  actividades: any
  formulario: FormGroup;


  constructor(private route: ActivatedRoute, 
              private td_service: TdserviceService,
              private formBuilder: FormBuilder,
              private datePipe: DatePipe)
              {
                this.route.params.subscribe(params => {
                  const idPerro = params['id_perro'];
                  if (idPerro) {
                    this.obtenerDatosDelPerro(idPerro);
                    this.obtenerActividadPerro(idPerro);
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
    console.log(this.perro)
  }

  obtenerDatosDelPerro(idPerro: number) {
    // Supongo que deberías proporcionar un token válido en lugar de "token"
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getPerroPorId(idPerro, token).subscribe((data) => {
        this.perro = data; // Asigna los datos del perro a la variable perro
        console.log('Datos del perro cargados:', this.perro);

      });
    } else {
      console.error('Token no encontrado en el Local Storage');
    }
  }

  obtenerActividadPerro(idPerro: number){
    const token = localStorage.getItem('token');
    if (token) {
      this.td_service.getActividadesPerro(idPerro, token).subscribe((data) => {
        this.actividades = data;
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
}



