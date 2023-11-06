import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api'; 



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menu: MenuItem[] = []; 
  
  constructor(){

  }
  
  ngOnInit() { 
    this.menu = [
      { 
        label: 'Perfil', 
      },
      { 
        label: 'Perros', 
      } 
    ]; 
  } 
}


/*
Ejemplo de como añadir sub menus

        items: [ 
          { 
            label: 'Angular 1'
          }, 
          { 
            label: 'Angular 2'
          } 
        ] 
*/