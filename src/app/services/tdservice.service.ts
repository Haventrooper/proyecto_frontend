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
  
  signUp(datosRegistro: any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`${this.url}/signup`, datosRegistro, httpOptions);
  }

  sendPerros(json:Array<string>, token: string){
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.post(`${this.url}/perrosUsuario`, json, {headers:headers})
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
    const url = `${this.url}/getActividad/${id}`;
    return this.http.get(url);
  }

  getCategorias(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/categorias`, { headers: headers });
  }
}
