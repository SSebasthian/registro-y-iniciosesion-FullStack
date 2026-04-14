import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { AutenticadorService } from '../../../arquitectura/servicio/autenticador.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { PermisosPerfilComponent } from '../../permisos/permisos-perfil/permisos-perfil.component';
import { PermisosUsuariosComponent } from '../../permisos/permisos-usuarios/permisos-usuarios.component';
import { PermisosRolComponent } from '../../permisos/permisos-rol/permisos-rol.component';
import { PermisosPermisosxrolComponent } from '../../permisos/permisos-permisosxrol/permisos-permisosxrol.component';
import { PermisosPermisosComponent } from '../../permisos/permisos-permisos/permisos-permisos.component';



@Component({
  selector: 'app-perfil',
  imports: [MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {

  // Variable donde se almacenan los datos del usuario
  Usuario: any;

  // Inyección del servicio que se conecta con el backend
  constructor(
    private autenticadorService: AutenticadorService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  // Método que se ejecuta al cargar el componente
  ngOnInit() {

    // 1. Verificar si hay sesión
    const usuario = localStorage.getItem('usuario');

    // 2. Si NO hay usuario → lo saco
    if (!usuario) {
      this.router.navigate(['/autenticacion/acceso']);
      return;
    }

    // 3. Si sí hay → cargar perfil
    // Se llama al servicio para obtener el perfil del usuario
    this.autenticadorService.getPerfil().subscribe({

      // Si la petición es exitosa
      next: (datos) => {
        this.Usuario = datos; // Guardamos los datos
        //console.log(datos); // Mostramos en consola
      },
      error: (err) => {
        console.error(err); // Mostramos el error
        // Si falla (ej: usuario borrado) → cerrar sesión
        this.router.navigate(['/autenticacion/acceso']);
      }
    });

    // ESCUCHAR CAMBIOS DEL DIALOG - EDITAR PERFIL
    this.autenticadorService.perfilActualizado$.subscribe(() => {
      this.cargarPerfil();
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


  //DIALOGOS PARA PERMISOS


  permisosPerfil() {
    const dialogRef = this.dialog.open(PermisosPerfilComponent, {
      width: '800px',
      height: '350px'
    });

    dialogRef.afterClosed().subscribe((resultado) => {

      // 👇 Si el dialog devolvió true → recargar perfil
      if (resultado) {
        this.cargarPerfil();
      }

    });
  }

  permisosUsuarios() {
    this.dialog.open(PermisosUsuariosComponent, {
      width: '800px',
      height: '600px'
    });
  }

  permisosRol() {
    this.dialog.open(PermisosRolComponent, {
      width: '800px',
      height: '600px'
    });
  }

  permisosPermisos() {
    this.dialog.open(PermisosPermisosComponent, {
      width: '800px',
      height: '600px'
    });
  }

  permisosxRol() {
    this.dialog.open(PermisosPermisosxrolComponent, {
      width: '800px',
      height: '600px'
    });
  }


  cargarPerfil() {
    this.autenticadorService.getPerfil().subscribe({
      next: (datos) => {
        this.Usuario = datos;
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/autenticacion/acceso']);
      }
    });
  }
}


