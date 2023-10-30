import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TdserviceService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000'

  login(user: string, password: string){
    return this.http.get(this.url + `/login?nombre=${user}&contrasena=${password}`);
  }

  

}
