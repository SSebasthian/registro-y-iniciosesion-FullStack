import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = 'http://localhost:8080/usuarios/perfil';

  // Subject para notificar cambios en el perfil
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();

  constructor(private http: HttpClient) { }



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
    return this.http.get(`${this.apiUrl}/${usuarioGuardado.usuario}`);
  }


  // --------------------
  // ACTUALIZAR PERFIL---
  // --------------------
  actualizarPerfil(usuario: string, datos: any) {
    return this.http.put(`${this.apiUrl}/${usuario}`, datos).pipe(
      tap(() => {
        this.notificarPerfilActualizado();
      })
    );;
  }



  // -----------------------
  // CAMBIAR CLAVE PERFIL---
  // -----------------------
  cambiarClave(usuario: string, actual: string, nueva: string) {
    return this.http.put(`${this.apiUrl}/${usuario}/clave`, {
      actual,
      nueva
    });
  }


  // -----------------
  // CAMBIOS PERFIL---
  // -----------------
  notificarPerfilActualizado() {
    this.perfilActualizado.next(true);
  }



}
