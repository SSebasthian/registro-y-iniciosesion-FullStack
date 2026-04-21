
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { inicioSesionSolicitud } from '../../interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from '../../interface/inicioSesionRespuesta.interface';
import { registroSolicitud } from '../../interface/registroSolicitud.interface';
import { registroRespuesta } from '../../interface/registroRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {

  // URL base del backend donde están los endpoints de usuarios
  private apiUrl = 'http://localhost:8080/';
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();


  constructor(private http: HttpClient) { }



  // ============================================
  // AUTENTICACION
  // ============================================


  // --------------------
  // INICIAR SESIÓN -----
  // --------------------
  inicioSesion(data: inicioSesionSolicitud): Observable<inicioSesionRespuesta> {
    return this.http.post<inicioSesionRespuesta>(`${this.apiUrl}usuarios/inicio-sesion`, data);
  }


  // -----------------------
  // REGISTRAR USUARIO -----
  // -----------------------
  registro(data: registroSolicitud): Observable<registroRespuesta> {
    return this.http.post<registroRespuesta>(`${this.apiUrl}usuarios/registrar`, data);
  }


  // ----------------
  // CERRAR PERFIL---
  // ----------------
  cerrarSesion() {
    // Elimina el usuario del localStorage para cerrar sesión
    localStorage.removeItem('usuario');
  }


  // ----------------------------------
  // VERIFICAR SI HAY SESION ACTIVA ---
  // ----------------------------------
  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  

  // ============================================
  // PERFIL DE USUARIO
  // ============================================

  // ----------------
  // OBTENER PERFIL--
  // ----------------
  // Obtiene el perfil del usuario logueado desde el backend  
  getPerfil(): Observable<any> {
    // Se obtiene el usuario guardado en el localStorage
    // Este valor se guarda al iniciar sesión
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    // Se construye la petición GET hacia el backend
    // http://localhost:8080/usuarios/perfil/admin
    return this.http.get(`${this.apiUrl}usuarios/perfil/${usuarioGuardado.usuario}`);
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

  
  // -----------------------
  // CAMBIAR CLAVE PERFIL---
  // -----------------------
  cambiarClave(usuario: string, actual: string, nueva: string) {
    return this.http.put(`${this.apiUrl}usuarios/perfil/${usuario}/clave`, {
      actual,
      nueva
    });
  }

}