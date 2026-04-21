import { FormsModule } from '@angular/forms';
import { AutenticadorService } from '../../../arquitectura/servicio/autenticacion/autenticador.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon'
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from "@angular/router";
import { inicioSesionSolicitud } from './../../../arquitectura/interface/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from './../../../arquitectura/interface/inicioSesionRespuesta.interface';



@Component({
  selector: 'app-acceso',
  imports: [MatIconModule, RouterLink, RouterModule, FormsModule, CommonModule],
  templateUrl: './acceso.component.html',
  styleUrl: './acceso.component.css'
})
export class AccesoComponent {

  usuario: string = '';  // almacena el usuario del formulario
  clave: string = '';    // almacena la clave del formulario
  mensaje: string = '';  // mensaje para mostrar en pantalla (exitoso o error)
  mostrarClave: boolean = false; // variable para controlar la visibilidad de la contraseña

  constructor(
    private autenticadorService: AutenticadorService,
    private router: Router
  ) { }


  // ---------------------------------------------------------
  // MÉTODO PARA INICIAR SESIÓN
  // ---------------------------------------------------------

  iniciarSesion() {
    // Creamos un objeto con los datos que necesita el backend
    const datos: inicioSesionSolicitud = {
      usuario: this.usuario,
      clave: this.clave
  };

  // Llamamos al servicio autenticadorService.iniciarSesion() {
  // Este devuelve un Observable, así que usamos subscribe() para recibir la respuesta
  this.autenticadorService.inicioSesion(datos).subscribe({
    
    // Si el backend responde correctamente (200 OK)
    next: (respuesta: inicioSesionRespuesta) => {

      // Guardamos el mensaje en la variable 'mensaje' para mostrarlo en pantalla
      this.mensaje = respuesta.mensaje;

      // Si el mensaje del backend indica login exitoso
      if (respuesta.mensaje === 'Inicio de Sesion Exitoso!!!'){

        // Guardamos en localStorage los datos recibidos del backend
        // (por ejemplo token, id de usuario, nombre, etc.)
       localStorage.setItem('usuario', JSON.stringify(respuesta));

        // Luego podrías redirigir a otra página, como un dashboard
        //console.log('Redirigiendo a Perfil...');
        this.router.navigate(['/autenticacion/perfil']);
      }
    },

    // Si ocurre un error en el servidor o no responde correctamente
    error: () => {
        this.mensaje = 'Error en el servidor';
      }
    });
  }


  // ---------------------------------------------------------
  // MÉTODOS PARA MOSTRAR/OCULTAR CONTRASEÑA
  // ---------------------------------------------------------

  toggleMostrarClave() {
    this.mostrarClave = !this.mostrarClave;
  }
}
