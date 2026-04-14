import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { AutenticadorService } from '../../../arquitectura/servicio/autenticador.service';




@Component({
  selector: 'app-permisos-perfil',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, CommonModule],
  templateUrl: './permisos-perfil.component.html',
  styleUrl: './permisos-perfil.component.css'
})
export class PermisosPerfilComponent {

  constructor(
    private autenticadorService: AutenticadorService,
    private dialog: MatDialogRef<PermisosPerfilComponent>
  ) { }

  editando: boolean = false;
  modoPassword: boolean = false;
  verPasswordActual = false;
  verPasswordNueva = false;
  claveActual: string = '';
  claveNueva: string = '';
  claveConfirmar: string = '';
  mensajeclave: string = '';

  usuario: any;

  ngOnInit() {
    this.autenticadorService.getPerfil().subscribe({
      next: (datos) => {
        this.usuario = datos;
        console.log('Se Cargo el Usuario:', datos.usuario)
        //console.log('Usuario real:', datos);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  editarPerfil() {
    this.editando = true;
  }

  guardarPerfil() {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');


    this.autenticadorService.actualizarPerfil(
      usuarioGuardado.usuario,
      this.usuario
    ).subscribe({

      next: (res:any) => {
        console.log('Perfil actualizado', res.usuario);
        //console.log('Perfil actualizado', res);
        this.usuario = res; //refrescar datos
        this.editando = false;
        // AVISAR AL PERFIL DEL CAMBIO
        this.autenticadorService.notificarPerfilActualizado();
      },

      error: (err) => {
        console.error('Error', err);
      }

    });
  }

  abrirPassword() {
    this.modoPassword = true;
  }

  guardarPassword() {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}');
    // VALIDACIONES
    if (!this.claveActual || !this.claveNueva || !this.claveConfirmar) {
      this.mensajeclave = 'Todos los campos son obligatorios';
      console.log(this.mensajeclave);
      return;
    }

    if (this.claveNueva !== this.claveConfirmar) {
      this.mensajeclave = 'Las contraseñas no coinciden';
      console.log(this.mensajeclave);
      return;
    }
    this.autenticadorService.cambiarClave(
      usuarioGuardado.usuario,
      this.claveActual,
      this.claveNueva
    ).subscribe({

      next: (res: any) => {
        this.mensajeclave = res.mensaje;
        console.log(this.mensajeclave);

        if (res.mensaje.includes('correctamente')) {
          this.claveActual = '';
          this.claveNueva = '';
          this.claveConfirmar = '';
          this.modoPassword = false;
        }
       

      },

      error: (err) => {
        console.error(err);
        this.mensajeclave = 'Error al cambiar contraseña';
      }

    });
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
    //console.log('Cancelado / vuelto atrás');
  }

}
