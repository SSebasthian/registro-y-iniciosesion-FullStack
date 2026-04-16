import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-permisos-permisos',
  imports: [CommonModule, MatIconModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule],
  templateUrl: './permisos-permisos.component.html',
  styleUrl: './permisos-permisos.component.css'
})
export class PermisosPermisosComponent {


  constructor(private dialog: MatDialogRef<PermisosPermisosComponent>) { }

  filtro: string = '';
  permisoSeleccionado: any = null;
  editando: boolean = false;
  modoCrearPermiso: boolean = false;
  verPermisosxUsuarios: boolean = false;
  usuariosPorPermiso: any[] = [];
  

  permisos = [
    {
      id: 1,
      nombre: 'ver_usuarios',
      usuariosxPermiso: 3
    },
    {
      id: 2,
      nombre: 'crear_usuarios',
      usuariosxPermiso: 10
    },
    {
      id: 3,
      nombre: 'editar_usuarios',
      usuariosxPermiso: 4
    },
    {
      id: 4,
      nombre: 'eliminar_usuarios',
      usuariosxPermiso: 5
    },
    {
      id: 5,
      nombre: 'ver_rol',
      usuariosxPermiso: 10
    },
    {
      id: 6,
      nombre: 'crear_rol',
      usuariosxPermiso: 4
    },
    {
      id: 7,
      nombre: 'editar_rol',
      usuariosxPermiso: 5
    }
  ];

  nuevoPermiso: any = {
    nombre: ''
  };

  editarPermiso(permiso: any) {
    this.permisoSeleccionado = { ...permiso };
    this.editando = true;
  }

  crearPermiso() {
    this.modoCrearPermiso = true;
    this.editando = false;

    this.nuevoPermiso = {
      nombre: ''
    };
  }

  volverListaPermisos() {
    this.verPermisosxUsuarios = false;
  }

  cantidadUsuariosPermiso(permiso: any) {
    this.verPermisosxUsuarios = true;
    this.editando = false;
    this.modoCrearPermiso = false;

    this.permisoSeleccionado = permiso;

    this.usuariosPorPermiso = [
      { nombre: 'Juan Danuela Perez Martinez', usuario: 'juan', activo: true },
      { nombre: 'Maria Lopez', usuario: 'maria', activo: true },
      { nombre: 'Carlos Ruiz', usuario: 'carlos', activo: false },
      { nombre: 'Maria Lopez', usuario: 'maria', activo: true },
      { nombre: 'Carlos Ruiz', usuario: 'carlos', activo: false },
      { nombre: 'Maria Lopez', usuario: 'maria', activo: true },
      { nombre: 'Carlos Ruiz', usuario: 'carlos', activo: false }
    ];
  }

  accionCancelar() {
    if (!this.editando && !this.modoCrearPermiso) {
      this.dialog.close();
      return;
    }
    this.editando = false;
    this.modoCrearPermiso = false;
    this.permisoSeleccionado = null;
  }
}
