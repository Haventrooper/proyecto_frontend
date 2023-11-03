import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TdserviceService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000'

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
  

  login(user: string, password: string){
    return this.http.get(this.url + `/login?nombre=${user}&contrasena=${password}`);
  }


  getActividades(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/actividades`, { headers: headers });
  }

  getActividadPorId(id: number, token:string) {
    const url = `${this.url}/getActividad/${id}`;
    return this.http.get(url);
  }
}
