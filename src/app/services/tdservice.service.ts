import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TdserviceService {

  constructor(private http: HttpClient) { }

  login(nombre: string, contrasena: string) {
    // Define los parámetros que deseas enviar
    const params = {
      nombre: nombre,
      contrasena: contrasena
    };

    // Realiza la solicitud POST al servidor
    return this.http.post('/login', params);
  }
}