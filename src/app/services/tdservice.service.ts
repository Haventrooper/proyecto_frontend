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
  

  login(user: string, password: string){
    return this.http.get(this.url + `/login?nombre=${user}&contrasena=${password}`);
  }

  auth(){
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });

    this.http.get(this.url + '/perrosUsuario', { headers }).subscribe((data) => {

    });
  }
}
