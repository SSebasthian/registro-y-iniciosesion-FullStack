import { FormsModule } from '@angular/forms';
import { AutenticadorService } from '../../../arquitectura/servicio/autenticador.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon'
import { RouterLink, RouterModule } from "@angular/router";
import { registroRespuesta } from './../../../arquitectura/interface/registroRespuesta.interface';
import { registroSolicitud } from './../../../arquitectura/interface/registroSolicitud.interface';


@Component({
  selector: 'app-registro',
  imports: [MatIconModule, RouterLink,RouterModule, FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  usuario: string = '';  // almacena el usuario del formulario
  nombre: string = '';   // almacena el nombre del formulario
  clave: string = '';    // almacena la clave del formulario
  mensaje: string = '';  // mensaje para mostrar en pantalla (exitoso o error)

  constructor(private autenticadorService: AutenticadorService) { }


  // ---------------------------------------------------------
  // MÉTODO PARA REGISTRAR USUARIO
  // ---------------------------------------------------------

  registrar() {
  const data: registroSolicitud = {
    usuario: this.usuario,
    nombre: this.nombre,
    clave: this.clave
  };


  // Llamamos al servicio autenticadorService.registro() {
  // Este devuelve un Observable, así que usamos subscribe() para recibir la respuesta
  this.autenticadorService.registro(data).subscribe({

    // Si el backend responde correctamente (200 OK)
    next: (respuesta: registroRespuesta) => {

      // Guardamos el mensaje en la variable 'mensaje' para mostrarlo en pantalla
      this.mensaje = respuesta.mensaje;

      // Si el mensaje del backend indica Registro exitoso
      if (respuesta.mensaje === 'Usuario registrado correctamente'){

        // Guardamos en localStorage los datos recibidos del backend
        // (por ejemplo token, id de usuario, nombre, etc.)
        localStorage.setItem('usuario', JSON.stringify(respuesta));

        // Luego podrías redirigir a otra página, como un Inicip
        console.log('Redirigiendo a Inicio...');
        // Aquí ponemos Router.navigate(['/inicio'])
      }
    },

    // Si ocurre un error en el servidor o no responde correctamente
    error: (err) => {
        this.mensaje = 'Error en el servidor';
      }
    });
  }

}