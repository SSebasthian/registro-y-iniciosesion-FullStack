
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { inicioSesionSolicitud } from '../interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from '../interface/inicioSesionRespuesta.interface';
import { registroSolicitud } from './../interface/registroSolicitud.interface';
import { registroRespuesta } from './../interface/registroRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {

  // URL base del backend donde están los endpoints de usuarios
  private apiUrl = 'http://localhost:8080/';

  // Inyectamos HttpClient para poder hacer peticiones HTTP (POST, GET, etc.)
  constructor(private http: HttpClient) { }



  // ---------------------------------------------------------
  // MÉTODO PARA INICIAR SESIÓN
  // ---------------------------------------------------------
  // Recibe un objeto con usuario y clave
  // Devuelve un Observable tipado como inicioSesionRespuesta INTERFACE

  inicioSesion(data: inicioSesionSolicitud): Observable<inicioSesionRespuesta> {
    // Envia una peticion POST a:
    // http://localhost:8080/usuarios/inicio-sesion
    return this.http.post<inicioSesionRespuesta>(`${this.apiUrl}usuarios/inicio-sesion`, data);
  }



  // ---------------------------------------------------------
  // MÉTODO PARA REGISTRAR USUARIO
  // ---------------------------------------------------------
  // Recibe un objeto con usuario y clave
  // Devuelve un Observable tipado como registroRespuesta INTERFACE

  registro(data: registroSolicitud): Observable<registroRespuesta> {
    // Envia una peticion POST a:
    // http://localhost:8080/usuarios/registrar
    return this.http.post<registroRespuesta>(`${this.apiUrl}usuarios/registrar`, data);
  }


  // ---------------------------------------------------------
  // MÉTODO PARA PERFIL
  // ---------------------------------------------------------

  // ----------------
  // OBTENER PERFIL--
  // ----------------
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();

  // Obtiene el perfil del usuario logueado desde el backend  
  getPerfil(): Observable<any> {
    // Se obtiene el usuario guardado en el localStorage
    // Este valor se guarda al iniciar sesión
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    // Se construye la petición GET hacia el backend
    // http://localhost:8080/usuarios/perfil/admin
    return this.http.get(`${this.apiUrl}usuarios/perfil/${usuarioGuardado.usuario}`);
  }

  // ----------------
  // CERRAR PERFIL---
  // ----------------
  cerrarSesion() {
    // Elimina el usuario del localStorage para cerrar sesión
    localStorage.removeItem('usuario');
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  // --------------------
  // ACTUALIZAR PERFIL---
  // --------------------
  actualizarPerfil(usuario: string, datos: any) {
    return this.http.put(`${this.apiUrl}usuarios/perfil/${usuario}`, datos);
  }

  // -----------------
  // CAMBIOS PERFIL---
  // -----------------
  notificarPerfilActualizado() {
    this.perfilActualizado.next(true);
  }

  // ----------------------
  // CERRAR CLAVE PERFIL---
  // ----------------------
  cambiarClave(usuario: string, actual: string, nueva: string) {
    return this.http.put(`${this.apiUrl}usuarios/perfil/${usuario}/clave`, {
      actual,
      nueva
    });
  }


  // ---------------------------------------------------------
  // MÉTODO PARA USUARIOS ADMINISTRADOR
  // ---------------------------------------------------------

  // -------------------
  // OBTENER USUARIOS---
  // -------------------
  obtenerUsuariosAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}usuarios/admin`);
  }

  // ----------------------
  // ACTUALZIAR USUARIOS---
  // ----------------------
  actualizarUsuariosAdmin(usuario: string, datos: any) {
    return this.http.put(`${this.apiUrl}usuarios/admin/${usuario}`, datos);
  }

  // -------------------
  // CABMIAR USUARIOS---
  // -------------------
  cambiarClaveAdmin(usuario: string, nueva: string) {
    return this.http.put(`${this.apiUrl}usuarios/admin/${usuario}/clave`, {
      nueva
    });
  }

  // ---------------------
  // REGISTRAR USUARIOS---
  // ---------------------
  registrarAdmin(data: any) {
    return this.http.post<registroRespuesta>(`${this.apiUrl}usuarios/admin/registrar`, data);
  }

  // --------------------
  // ELIMINAR USUARIOS---
  // --------------------
  eliminarUsuarioAdmin(usuario: string) {
    return this.http.delete(`${this.apiUrl}usuarios/admin/${usuario}`);
  }


  // -------------------
  // OBTENER ROLES------
  // -------------------
  obtenerRoles() {
    return this.http.get<any[]>(`${this.apiUrl}usuarios/admin/roles`);
  }

  // --------------------------
  // OBTENER USUARIOS X ROL ---
  // --------------------------
  obtenerUsuariosPorRol(rolId: number) {
    return this.http.get<any[]>(`${this.apiUrl}usuarios/admin/roles/${rolId}`);
  }

  contarUsuariosPorRol(rolId: number) {
    return this.http.get<number>(`${this.apiUrl}usuarios/admin/roles/${rolId}/cantidad`);
  }

  actualizarRol(rolId: number, datos: any) {
    return this.http.put<any>(`${this.apiUrl}roles/admin/${rolId}`, datos);
  }

  eliminarRol(id: number) {
    return this.http.delete(`${this.apiUrl}roles/admin/${id}`,{
      responseType: 'text'
    });
  }

  crearRol(rol: any) {
    return this.http.post(`${this.apiUrl}roles/admin/registrar`, rol);
  }


}