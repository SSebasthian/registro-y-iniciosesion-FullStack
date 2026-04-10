import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inicioSesionSolicitud } from '../interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from '../interface/inicioSesionRespuesta.interface';

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

}