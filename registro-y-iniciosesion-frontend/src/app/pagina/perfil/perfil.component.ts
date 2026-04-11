import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { AutenticadorService } from '../../arquitectura/servicio/autenticador.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-perfil',
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  // Variable donde se almacenan los datos del usuario
  Usuario: any;

  // Inyección del servicio que se conecta con el backend
  constructor(
    private autenticadorService: AutenticadorService,
    private router: Router
  ) { }

  // Método que se ejecuta al cargar el componente
  ngOnInit() {
    // Se llama al servicio para obtener el perfil del usuario
    this.autenticadorService.getPerfil().subscribe({

      // Si la petición es exitosa
      next: (datos) => {
        this.Usuario = datos; // Guardamos los datos
        //console.log(datos); // Mostramos en consola
      },
      error: (err) => {
        console.error(err); // Mostramos el error
      }
    });
  }


   cerrarSesion() {
    // Llamamos al método del servicio para cerrar sesión
    this.autenticadorService.cerrarSesion(); 
    // limpiar consola o estado
    this.Usuario = null;
    // Redirigir a la página de inicio de sesión
    this.router.navigate(['/autenticacion/acceso']);
  }
}
