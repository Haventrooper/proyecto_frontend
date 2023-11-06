import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TdserviceService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000'


  login(user: string, password: string){
    return this.http.get(this.url + `/login?nombre=${user}&contrasena=${password}`);
  }

  getPerros(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/perrosUsuario`, { headers: headers });
  }

  getUsuario(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/usuario`, { headers: headers });
  }

  getNombreUsuario(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/nombreUsuario`, { headers: headers });
  }

  getActividades(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/actividades`, { headers: headers });
  }

  getActividadPorId(id: number, token:string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getActividad/${id}`, { headers: headers });
  }

  getCategorias(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/categorias`, { headers: headers });
  }

  getPasos(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getPasos/${id}`, { headers: headers });
  }

  getPerroPorId(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/perro/${id}`, { headers: headers });
  }
  getActividadesPorCategoria(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/actividadesPorCategoria/${id}`, { headers: headers });
  }
  getSugerencias(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/sugerencias`, { headers: headers });
  }

  //Post

  signUp(datosRegistro: any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${this.url}/signup`, datosRegistro, httpOptions);
  }

  postPerro(datosRegistro: any, token: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Añade el token de autenticación en el encabezado si es necesario
      })
    };
    return this.http.post(`${this.url}/registroPerro`, datosRegistro, httpOptions);
  }
}
