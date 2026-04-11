
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inicioSesionSolicitud } from '../interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from '../interface/inicioSesionRespuesta.interface';
import { registroSolicitud } from './../interface/registroSolicitud.interface';
import { registroRespuesta } from './../interface/registroRespuesta.interface';



@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {

  // URL base del backend donde están los endpoints de usuarios
  private apiUrl = 'http://localhost:8080/usuarios'; 

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
    return this.http.post<inicioSesionRespuesta>(`${this.apiUrl}/inicio-sesion`, data);
  }



  // ---------------------------------------------------------
  // MÉTODO PARA REGISTRAR USUARIO
  // ---------------------------------------------------------
  // Recibe un objeto con usuario y clave
  // Devuelve un Observable tipado como registroRespuesta INTERFACE

  registro(data: registroSolicitud): Observable<registroRespuesta> {
    // Envia una peticion POST a:
    // http://localhost:8080/usuarios/registrar
    return this.http.post<registroRespuesta>(`${this.apiUrl}/registrar`, data);
  }


  // ---------------------------------------------------------
  // MÉTODO PARA OBTENER PERFIL
  // ---------------------------------------------------------
  // Obtiene el perfil del usuario logueado desde el backend  
  getPerfil(): Observable<any> {
    // Se obtiene el usuario guardado en el localStorage
    // Este valor se guarda al iniciar sesión
    const usuario = localStorage.getItem('usuario');
    // Se construye la petición GET hacia el backend
    // http://localhost:8080/usuarios/perfil/admin
    return this.http.get(`${this.apiUrl}/perfil/${usuario}`);
  }

  cerrarSesion() {
    // Elimina el usuario del localStorage para cerrar sesión
    localStorage.removeItem('usuario');
  }

}