import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-permisos-usuarios',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, CommonModule],
  templateUrl: './permisos-usuarios.component.html',
  styleUrl: './permisos-usuarios.component.css'
})
export class PermisosUsuariosComponent {


  constructor(private dialog: MatDialogRef<PermisosUsuariosComponent>) { }

  filtro: string = '';
  usuarioSeleccionado: any = null;
  editando: boolean = false;
  modoPassword: boolean = false;
  verPasswordActual = false;
  verPasswordNueva = false;
  modoCrearUsuario: boolean = false;

  usuarios = [
    {
      usuario: 'usuario1',
      nombre: 'NombreApellido1',
      rol: 'Administrador',
      activo: true
    },
    {
      usuario: 'usuario2',
      nombre: 'NombreApellido2',
      rol: 'Administrador',
      activo: true
    },
    {
      usuario: 'usuario3',
      nombre: 'NombreApellido3',
      rol: 'Normal',
      activo: false
    },
    {
      usuario: 'usuario4',
      nombre: 'NombreApellido4',
      rol: 'Administrador',
      activo: true
    },
    {
      usuario: 'usuario5',
      nombre: 'NombreApellido5',
      rol: 'Normal',
      activo: true
    },
    {
      usuario: 'usuario6',
      nombre: 'NombreApellido6',
      rol: 'Normal',
      activo: false
    }
  ];

  nuevoUsuario: any = {
    nombre: '',
    usuario: '',
    clave: '',
    rol: ''
  };




  volverLista() {
    this.editando = false;
    this.usuarioSeleccionado = null;
  }

  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    this.editando = true;
    this.modoPassword = false;
  }

  guardarUsuario() {
    console.log('Usuario editado:', this.usuarioSeleccionado);
    this.editando = false;
  }

  abrirPassword() {
    this.modoPassword = true;
  }

  guardarPassword() {
    console.log('Guardar nueva contraseña');
    this.modoPassword = false;
  }


  accionCancelar() {
    if (!this.editando && !this.modoPassword && !this.modoCrearUsuario) {
      this.dialog.close();
      return;
    }

    this.editando = false;
    this.modoPassword = false;
    this.modoCrearUsuario = false;
    this.usuarioSeleccionado = null;
  }




  crearUsuario() {
    this.modoCrearUsuario = true;
    this.editando = false;
    this.modoPassword = false;

    this.nuevoUsuario = {
      nombre: '',
      usuario: '',
      clave: '',
      rol: ''
    };
  }

  guardarNuevoUsuario() {
    console.log('Nuevo usuario:', this.nuevoUsuario);

    this.usuarios.push({ ...this.nuevoUsuario, activo: true });

    this.modoCrearUsuario = false;
  }

}
