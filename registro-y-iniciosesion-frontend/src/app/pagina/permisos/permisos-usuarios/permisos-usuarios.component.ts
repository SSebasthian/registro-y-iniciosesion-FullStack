import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuariosPermisosService } from './../../../arquitectura/servicio/permisos/usuarios-permisos.service';
import { RolPermisosService } from './../../../arquitectura/servicio/permisos/rol-permisos.service';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';




@Component({
  selector: 'app-permisos-usuarios',
  imports: [MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, CommonModule, MatSelectModule],
  templateUrl: './permisos-usuarios.component.html',
  styleUrl: './permisos-usuarios.component.css'
})
export class PermisosUsuariosComponent {

  filtro: string = '';                  /** Texto de filtro para búsqueda de usuarios */
  usuarioSeleccionado: any = null;      /** Usuario seleccionado para edición */
  editando: boolean = false;            /** Indica si se está en modo edición */
  modoPassword: boolean = false;        /** Modo cambio de contraseña */
  verPasswordActual = false;            /** Mostrar/ocultar password actual */
  verPasswordNueva = false;             /** Mostrar/ocultar password nueva */
  modoCrearUsuario: boolean = false;    /** Modo creación de usuario */
  usuarios: any[] = [];                 /** Lista de usuarios */
  roles: any[] = [];                    /** Lista de roles disponibles */
  usuarioOriginal: string = '';         /** Usuario original antes de editar */
  nuevaClave: string = '';              /** Nueva contraseña */
  confirmarClave: string = '';          /** Confirmación de contraseña */

  constructor(
    private dialog: MatDialogRef<PermisosUsuariosComponent>,
    private usuariosPermisosService: UsuariosPermisosService,
    private rolPermisosService: RolPermisosService,
    private perfilService: PerfilService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  /****************************************************
  /*** Obtiene la lista de usuarios desde el backend **
  *****************************************************/
  cargarUsuarios() {
    this.usuariosPermisosService.obtenerUsuariosAdmin().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Se Listaron los Usuarios');
        //console.log(this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios admin', err);
      }

    });
  }

  /**********************************************
   * Obtiene la lista de roles desde el backend *
   **********************************************/
  cargarRoles() {
    this.rolPermisosService.obtenerRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error(err)
    });
  }

  /**********************************************
   **** Compara dos roles para el select *********
   **********************************************/
  compararRoles(r1: any, r2: any) {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  /**********************************************
   ***** Vuelve a diseño listar usuarios ********
   **********************************************/
  volverLista() {
    this.editando = false;
    this.usuarioSeleccionado = null;
  }

  /**********************************************
   *** Abre formulario de edición de usuario ****
   **********************************************/
  editarUsuario(usuario: any) {
    this.usuarioSeleccionado = { ...usuario };
    this.usuarioOriginal = usuario.usuario;
    this.editando = true;
    this.modoPassword = false;
    console.log('Se Selecciona Usuario: ', this.usuarioSeleccionado.usuario);
  }

  /**********************************************
   **** Guarda cambios del usuario editado ******
   **********************************************/
  guardarUsuario() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuariosPermisosService.actualizarUsuariosAdmin(this.usuarioOriginal, this.usuarioSeleccionado).subscribe({

      next: () => {
        // SI ES EL MISMO USUARIO LOGUEADO
        if (usuarioActual.usuario === this.usuarioOriginal) {

          const usuarioActualizado = {
            ...usuarioActual,
            usuario: this.usuarioSeleccionado.usuario, // 👈 nuevo username
            nombre: this.usuarioSeleccionado.nombre,
            rol: this.usuarioSeleccionado.rol.nombre
          };

          // ACTUALIZAR LOCALSTORAGE
          localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

          // NOTIFICAR A TODA LA APP
          this.perfilService.notificarPerfilActualizado();
        }

        // refrescar lista
        this.cargarUsuarios();

        this.editando = false;
        console.log('Usuario actualizado correctamente');
      },
      error: (err) => {
        console.error('Error', err);
      }
    });
  }

  /**********************************************
   **** Activa modo cambio de contraseña ********
   **********************************************/
  abrirPassword() {
    this.modoPassword = true;
  }

  /**********************************************
   **** Guarda nueva contraseña del usuario *****
   **********************************************/
  guardarPassword() {
    // VALIDACIÓN
    if (this.nuevaClave !== this.confirmarClave) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    this.usuariosPermisosService
      .cambiarClaveAdmin(this.usuarioSeleccionado.usuario, this.nuevaClave)
      .subscribe({
        next: (res: any) => {
          console.log(res.mensaje);

          this.modoPassword = false;
          this.nuevaClave = '';
          this.confirmarClave = '';
        },
        error: (err) => {
          console.error('Error cambiando clave', err);
        }
      });
  }


  /**********************************************
   **** Cancela cualquier operación activa ******
   **********************************************/
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


  /**********************************************
   ************ Objeto para nuevo usuario *******
   **********************************************/
  nuevoUsuario: any = {
    nombre: '',
    usuario: '',
    clave: '',
    rol: ''
  };
  
  /**********************************************
   ** Activa formulario de creación de usuario **
   **********************************************/
  crearUsuario() {
    this.modoCrearUsuario = true;
    this.editando = false;
    this.modoPassword = false;

    this.nuevoUsuario = {
      nombre: '',
      usuario: '',
      clave: '',
      rol: 2
    };
  }

  /**********************************************
   ** Guarda un nuevo usuario en el sistema *****
   **********************************************/
  guardarNuevoUsuario() {
    if (!this.nuevoUsuario.nombre ||
      !this.nuevoUsuario.usuario ||
      !this.nuevoUsuario.clave ||
      !this.nuevoUsuario.rol) {

      alert('Todos los campos son obligatorios');
      return;
    }
    const data = {
      usuario: this.nuevoUsuario.usuario,
      clave: this.nuevoUsuario.clave,
      nombre: this.nuevoUsuario.nombre,
      rolId: this.nuevoUsuario.rol
    };

    this.usuariosPermisosService.registrarAdmin(data).subscribe({
      next: (res) => {
        console.log(res.mensaje);
        alert(res.mensaje);

        // recargar lista
        this.cargarUsuarios();

        // volver a lista
        this.modoCrearUsuario = false;


      },
      error: (err) => {
        console.error('Error creando usuario', err);
      }
    });
  }

  /**********************************************
   **** Filtra usuarios por nombre o usuario ****
   **********************************************/
  get usuariosFiltrados() {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) return this.usuarios;

    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(texto) ||
      u.usuario.toLowerCase().includes(texto)
    );
  }

  /**********************************************
   **** Elimina un usuario del sistema **********
   **********************************************/
  eliminarUsuario(usuario: any) {

    const confirmacion = confirm(`¿Seguro que deseas eliminar al usuario ${usuario.usuario}?`);

    if (!confirmacion) return;

    this.usuariosPermisosService.eliminarUsuarioAdmin(usuario.usuario).subscribe({
      next: (res: any) => {

        console.log(res.mensaje || 'Usuario eliminado correctamente');

        // refrescar lista
        this.cargarUsuarios();

      },
      error: (err) => {
        console.error('Error eliminando usuario', err);
      }
    });
  }

}
