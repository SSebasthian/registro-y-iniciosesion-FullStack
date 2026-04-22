import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { RolPermisosService } from './../../../arquitectura/servicio/permisos/rol-permisos.service';
import { UsuariosPermisosService } from './../../../arquitectura/servicio/permisos/usuarios-permisos.service';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';



@Component({
  selector: 'app-permisos-rol',
  imports: [CommonModule, MatIconModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule],
  templateUrl: './permisos-rol.component.html',
  styleUrl: './permisos-rol.component.css'
})
export class PermisosRolComponent implements OnInit {

  filtro: string = '';
  rolSeleccionado: any = null;
  editando: boolean = false;
  modoCrearRol: boolean = false;
  verRolesxUsuarios: boolean = false;
  roles: any[] = [];
  usuariosPorRol: any[] = [];
  usuarioActual: any = null;

  constructor(
    private dialog: MatDialogRef<PermisosRolComponent>,
    private rolPermisosService: RolPermisosService,
    private usuariosPermisosService: UsuariosPermisosService,
    private perfilService: PerfilService
  ) { }

  ngOnInit() {
    this.cargarRoles();
    this.cargarUsuarioActual();
  }

  nuevoRol: any = {
    nombre: ''
  };

  // Nuevo método: Cargar usuario actual para saber su rol
  cargarUsuarioActual() {
    this.perfilService.getPerfil().subscribe({
      next: (datos) => {
        this.usuarioActual = datos;
        //console.log('Usuario actual - Rol ID:', this.usuarioActual?.rol?.id);
        //console.log('Usuario actual - Rol nombre:', this.usuarioActual?.rol?.nombre);
      },
      error: (err) => {
        console.error('Error al cargar usuario actual:', err);
      }
    });
  }

  cargarRoles() {
    this.rolPermisosService.obtenerRoles().subscribe({
      next: (data) => {
        this.roles = data;

        // traer conteo por cada rol
        console.log('Se Listan Los Roles');
        this.roles.forEach(rol => {
          this.usuariosPermisosService.contarUsuariosPorRol(rol.id)
            .subscribe(count => {
              rol.usuariosxRol = count;
            });
        });
      }
    });
  }


  editarRol(rol: any) {
    this.rolSeleccionado = { ...rol };
    console.log('Rol seleccionado para edición:', this.rolSeleccionado.nombre);
    this.editando = true;
  }


  guardarRol() {
    const rolId = this.rolSeleccionado.id;
    const esMiRol = this.usuarioActual?.rol?.id === rolId;

    this.rolPermisosService.actualizarRol(
      this.rolSeleccionado.id,
      this.rolSeleccionado
    ).subscribe({
      next: (resp) => {
        this.editando = false;
        this.cargarRoles(); // refrescar lista


        // SI ES MI ROL, NOTIFICAR PARA ACTUALIZAR PERFIL
        if (esMiRol) {
          //console.log('Mi rol fue modificado, actualizando perfil...');

          // Forzar actualización del perfil
          this.perfilService.notificarPerfilActualizado();

          // También actualizar localStorage directamente
          const usuarioLS = JSON.parse(localStorage.getItem('usuario') || '{}');
          if (usuarioLS.rol) {
            usuarioLS.rol.nombre = this.rolSeleccionado.nombre;
            localStorage.setItem('usuario', JSON.stringify(usuarioLS));
          }

        }
      },
      error: (err) => console.error(err)
    });
    console.log('Rol actualizado:', this.rolSeleccionado.nombre);
  }


  eliminarRol(rol: any) {
    if (!confirm(`¿Seguro que quieres eliminar el rol "${rol.nombre}"?`)) {
      return;
    }

    this.rolPermisosService.eliminarRol(rol.id).subscribe({
      next: (mensaje: String) => {
        alert(mensaje);
        console.log(mensaje);
        this.cargarRoles(); // refresca la lista
      },
      error: (err) => {
        console.log("ERROR COMPLETO:", err);
        alert("Error eliminando rol");
      }
    });
  }


  crearRol() {
    this.modoCrearRol = true;
    this.editando = false;

    this.nuevoRol = {
      nombre: ''
    };
  }

  crearNuevoRol() {
    this.rolPermisosService.crearRol(this.nuevoRol).subscribe({
      next: (resp) => {
        console.log('Rol creado:', resp);

        this.modoCrearRol = false;
        this.nuevoRol = { nombre: '' };

        this.cargarRoles(); // refresca lista
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  //Buscar rol por nombre
  get rolesFiltrados() {
    if (!this.filtro) return this.roles;

    return this.roles.filter(rol =>
      rol.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }


  volverListaRoles() {
    this.verRolesxUsuarios = false;
  }


  cantidadUsuariosRol(rol: any) {
    this.verRolesxUsuarios = true;
    this.editando = false;
    this.modoCrearRol = false;

    this.rolSeleccionado = rol;
    this.usuariosPorRol = [];

    this.usuariosPermisosService.obtenerUsuariosPorRol(rol.id).subscribe({
      next: (datos) => {
        this.usuariosPorRol = datos;
      },
      error: (err) => {
        console.error(err);
        this.usuariosPorRol = [];
      }
    })

  }


  accionCancelar() {
    if (!this.editando && !this.modoCrearRol) {
      this.dialog.close();
      return;
    }
    this.editando = false;
    this.modoCrearRol = false;
    this.rolSeleccionado = null;
  }




}
