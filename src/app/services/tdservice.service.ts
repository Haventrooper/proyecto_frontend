import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TdserviceService {

  actividadesSeleccionadas: number[] = [];

  constructor(private http: HttpClient) { }

  url = 'http://localhost:3000'


  login(email: string, password: string){
    return this.http.get(this.url + `/login?email=${email}&contrasena=${password}`);
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

  getRazas(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.url}/razas`, { headers: headers });
  }

  agregarActividadSeleccionada(idActividad: number): void {
    this.actividadesSeleccionadas.push(idActividad);
  }

  obtenerActividadesSeleccionadas(): number[] {
    return this.actividadesSeleccionadas;
  }

  postEntrenamiento(idUsuario: number, idPerro: number, actividadesSeleccionadas: number[]) {
    const body = {
      id_usuario: idUsuario,
      id_perro: idPerro,
      actividadesSeleccionadas: actividadesSeleccionadas
    };
    return this.http.post(`${this.url}/registroEntrenamiento/${idUsuario}`, body);
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

  getActividadesPerro(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/actividadPerro/${id}`, { headers: headers });
  }

  getVerificarActividad(idPerro: number, idActividad: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/verificarActividad/${idPerro}/${idActividad}`, { headers: headers });
  }

  getActividadesPerroRecientes(idPerro: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/actividadesRecientes/${idPerro}`, { headers: headers });
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
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.http.post(`${this.url}/registroPerro`, datosRegistro, httpOptions);
  }

  postActividadPerro(idPerro: number, idActividad: number, contador: number, token: string): Observable<any>{ 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    const body = {idPerro, idActividad, contador};
    return this.http.post(`${this.url}/guardarActividad/${idPerro}/${idActividad}`, body, httpOptions);
  }

  postActividadPerroReciente(idPerro: number, idActividad: number, fecha_reciente: Date, token: string): Observable<any>{ //Añadir actividad reciente
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const body = {idPerro, idActividad, fecha_reciente: fecha_reciente.toISOString().slice(0, 19).replace('T', ' ')}; //Añadir fecha_reciente
    return this.http.post(`${this.url}/guardarActividadReciente/${idPerro}/${idActividad}`, body, httpOptions);
  }

  private perroSeleccionadoKey = 'perroSeleccionado';

  private perroSeleccionado = new BehaviorSubject<any>(null);
  perroSeleccionado$ = this.perroSeleccionado.asObservable();
  
  actualizarPerroSeleccionado(perro: any) {
    this.perroSeleccionado.next(perro);
  }


  //PUT

  putContador(idPerro: number, idActividad: number, contador: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const body = { contador };

    return this.http.put(`${this.url}/actualizarActividad/${idPerro}/${idActividad}`, body, httpOptions);

  }
  putModificarUsuario(datosActualizados: any, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
        
    return this.http.put(`${this.url}/modificarUsuario`, datosActualizados, httpOptions);
  }

  putModificarPerro(idPerro: number, datosActualizados: any, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put(`${this.url}/modificarPerro/${idPerro}`, datosActualizados, httpOptions);
  }

  
  deshabilitarPerro(idPerro: number, deshabilitado: boolean, token: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const body = {
      id_perro: idPerro,
      deshabilitado: deshabilitado,
    };
    return this.http.put(`${this.url}/deshabilitarPerro/${idPerro}`,body, httpOptions)
  }

  //Delete

  deleteUsuario(idUsuario: string, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.url}/eliminarUsuario/${idUsuario}`, httpOptions);
  }

  deletePerro(idPerro: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete(`${this.url}/eliminarPerro/${idPerro}`, httpOptions);
  }

  eliminarActividadPorPerro(idPerro: number, idActividad: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.url}/eliminarActividadPorPerro/${idPerro}/${idActividad}`, httpOptions);
  }

  
  //FUNCIONES ADMINISTRADORES
  
  //LOGIN ADMINISTRADOR
  loginAdmin(email: string, password: string){
    return this.http.get(this.url + `/admin?email=${email}&contrasena=${password}`);
  }

  //GET

  getCategoriasAdmin(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getCategorias`, { headers: headers });
  }
  getActividadesAdmin(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/actividadesAdmin`, { headers: headers });
  }
  
  getPasosActividadesAdmin(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/pasosActividad/${id}`, { headers: headers });
  }
  
  getRazasAdmin(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getRazas`, { headers: headers });
  }
  getRazasIdAdmin(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getRazas/${id}`, { headers: headers });
  }
  getSugerenciasAdmin(token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getSugerencias`, { headers: headers });
  }
  getSugerenciasIdAdmin(id: number, token: string){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.url}/getSugerencias/${id}`, { headers: headers });
  }

  //POST

  adminPostActividad(datosActividad: any, token: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post(`${this.url}/actividadesAdmin`, datosActividad, httpOptions);
  }

  adminPostPaso(datosPaso: any, token: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.http.post(`${this.url}/pasoActividad`, datosPaso, httpOptions);
  }
  postCategoria(datosCategoria: any, token: string): Observable<any>{ 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post(`${this.url}/postCategoria`, datosCategoria, httpOptions);
  }

  postRazaAdmin(nombre: any, token: string): Observable<any>{ 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post(`${this.url}/postRaza`, nombre, httpOptions);
  }

  postSugerenciaAdmin(datosSugerencia: any, token: string): Observable<any>{ 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
    return this.http.post(`${this.url}/postSugerencia`, datosSugerencia, httpOptions);
  }

  //DELETE
  deleteCategoria(idCat: number, token: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.url}/deleteCategoria/${idCat}`, httpOptions);
  }

  deleteActividadYPasos(idActividad: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.url}/eliminarActividadYPasos/${idActividad}`, httpOptions);
  }

  deletePaso(idPaso: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.url}/eliminarPaso/${idPaso}`, httpOptions);
  }

  deleteSugerencia(idSugerencia: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  
    return this.http.delete(`${this.url}/eliminarSugerencia/${idSugerencia}`, httpOptions);
  }

  deleteRaza(idRaza: number, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  
    return this.http.delete(`${this.url}/eliminarRaza/${idRaza}`, httpOptions);
  }

}
