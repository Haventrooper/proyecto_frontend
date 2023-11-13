import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor( private router: Router){}

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
