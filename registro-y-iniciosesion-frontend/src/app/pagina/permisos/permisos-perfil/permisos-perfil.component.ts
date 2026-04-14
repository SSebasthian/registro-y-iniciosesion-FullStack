import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-permisos-perfil',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, CommonModule],
  templateUrl: './permisos-perfil.component.html',
  styleUrl: './permisos-perfil.component.css'
})
export class PermisosPerfilComponent {

  constructor(private dialog: MatDialogRef<PermisosPerfilComponent>) {}

  editando: boolean = false;
  modoPassword: boolean = false;
  verPasswordActual = false;
  verPasswordNueva = false;

  usuarioPrueba = {
    usuario: 'Usuarioprueba',
    nombre: 'Usuario Prueba Eliminar',
    rol: 'Administrador',
    activo: true
  };


  editarPerfil() {
    this.editando = true;
  }

  guardarPerfil() {
    console.log('Guardar perfil:', this.usuarioPrueba);
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
    // MODO NORMAL → cerrar dialog
    if (!this.editando && !this.modoPassword) {
      this.dialog.close();
      return;
    }

    // MODO EDICIÓN O PASSWORD → resetear
    this.editando = false;
    this.modoPassword = false;

    console.log('Cancelado / vuelto atrás');
    }

}
