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
  selector: 'app-permisos-rol',
  imports: [CommonModule, MatIconModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule],
  templateUrl: './permisos-rol.component.html',
  styleUrl: './permisos-rol.component.css'
})
export class PermisosRolComponent {

  constructor(private dialog: MatDialogRef<PermisosRolComponent>) { }

  filtro: string = '';
  rolSeleccionado: any = null;
  editando: boolean = false;
  modoCrearRol: boolean = false;
  verRolesxUsuarios: boolean = false;
  usuariosPorRol: any[] = [];

  roles = [
    {
      nombre: 'Categoria A',
      usuariosxRol: 3
    },
    {
      nombre: 'Categoria B',
      usuariosxRol: 10
    },
    {
      nombre: 'Categoria C',
      usuariosxRol: 4
    },
    {
      nombre: 'Categoria D',
      usuariosxRol: 5
    }
  ];

  nuevoRol: any = {
    nombre: ''
  };


  editarRol(rol: any) {
    this.rolSeleccionado = { ...rol };
    this.editando = true;
  }

  crearRol() {
    this.modoCrearRol = true;
    this.editando = false;

    this.nuevoRol = {
      nombre: ''
    };
  }
  volverListaRoles() {
    this.verRolesxUsuarios = false;
  }


  cantidadUsuariosRol(rol: any) {
    this.verRolesxUsuarios = true;
    this.editando = false;
    this.modoCrearRol = false;

    this.rolSeleccionado = rol;

    this.usuariosPorRol = [
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
    if (!this.editando && !this.modoCrearRol) {
      this.dialog.close();
      return;
    }
    this.editando = false;
    this.modoCrearRol = false;
    this.rolSeleccionado = null;
  }




}
