import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RolPermisosService } from './../../../arquitectura/servicio/permisos/rol-permisos.service';
import { UsuariosPermisosService } from './../../../arquitectura/servicio/permisos/usuarios-permisos.service';
import { PerfilService } from '../../../arquitectura/servicio/autenticacion/perfil.service';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';



@Component({
  selector: 'app-permisos-rol',
  imports: [CommonModule, MatIconModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, MatAutocompleteModule],
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

  // ============================================
  // VARIABLES PARA AUTOCOMPLETADO
  // ============================================
  rolesFiltradosSugerencia: any[] = [];
  buscarRolActivo: boolean = false;
  mensajeError: string = '';
  rolesFiltradosSugerenciaEditar: any[] = [];
  buscarRolEditarActivo: boolean = false;
  mensajeErrorEditar: string = '';


  constructor(
    private dialog: MatDialogRef<PermisosRolComponent>,
    private rolPermisosService: RolPermisosService,
    private usuariosPermisosService: UsuariosPermisosService,
    private perfilService: PerfilService,
    public permisoModuloService: PermisoModuloService

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


  // ============================================
  // MÉTODOS PARA AUTOCOMPLETADO
  // ============================================

  /** Filtra roles existentes mientras escribe */
  filtrarRolesNuevos() {
    const texto = this.nuevoRol.nombre?.toLowerCase() || '';
    this.buscarRolActivo = texto.length > 0;

    if (texto.length > 0) {
      // Filtrar roles existentes que coincidan con lo que escribe
      this.rolesFiltradosSugerencia = this.roles
        .filter(rol => rol.nombre.toLowerCase().includes(texto))
        .slice(0, 10);

      // Verificar si el nombre exacto ya existe
      const existeExactamente = this.roles.some(rol =>
        rol.nombre.toLowerCase() === texto
      );

      if (existeExactamente && texto.trim() !== '') {
        this.mensajeError = `El rol "${this.nuevoRol.nombre}" ya existe`;
      } else {
        this.mensajeError = '';
      }
    } else {
      this.rolesFiltradosSugerencia = [];
      this.mensajeError = '';
    }
  }


  /** Filtra roles existentes mientras escribe en edición */
  filtrarRolesEditar() {
    const texto = this.rolSeleccionado?.nombre?.toLowerCase() || '';
    this.buscarRolEditarActivo = texto.length > 0;

    if (texto.length > 0) {
      // Excluir el rol actual de las sugerencias
      this.rolesFiltradosSugerenciaEditar = this.roles
        .filter(rol => 
          rol.id !== this.rolSeleccionado?.id && // No mostrar el rol actual
          rol.nombre.toLowerCase().includes(texto)
        )
        .slice(0, 10);
      
      // Verificar si el nombre exacto ya existe (excluyendo el rol actual)
      const existeExactamente = this.roles.some(rol =>
        rol.id !== this.rolSeleccionado?.id &&
        rol.nombre.toLowerCase() === texto
      );
      
      if (existeExactamente && texto.trim() !== '') {
        this.mensajeErrorEditar = `El rol "${texto}" ya existe`;
      } else {
        this.mensajeErrorEditar = '';
      }
    } else {
      this.rolesFiltradosSugerenciaEditar = [];
      this.mensajeErrorEditar = '';
    }
  }


  /** Limpia el mensaje de error */
  limpiarError() {
    this.mensajeError = '';
  }



  // ============================================
  // MÉTODOS CRUD
  // ============================================

  editarRol(rol: any) {
    // Verificar permiso para editar
    if (!this.permisoModuloService.puede('roles', 'editar')) {
      alert('No tienes permiso para editar roles');
      return;
    }

    this.rolSeleccionado = { ...rol };
    console.log('Rol seleccionado para edición:', this.rolSeleccionado.nombre);
    this.editando = true;
    this.mensajeErrorEditar = '';
  }



  guardarRol() {

    // Verificar si hay error de duplicado
    if (this.mensajeErrorEditar) {
      alert(this.mensajeErrorEditar);
      return;
    }

    
    // Verificar permiso para editar
    if (!this.permisoModuloService.puede('roles', 'editar')) {
      alert('No tienes permiso para editar roles');
      return;
    }

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

          // También actualizar localStorage directamente
          const usuarioLS = JSON.parse(localStorage.getItem('usuario') || '{}');
          usuarioLS.rol = this.rolSeleccionado.nombre;
          localStorage.setItem('usuario', JSON.stringify(usuarioLS));


          // Forzar actualización del perfil
          this.perfilService.notificarPerfilActualizado();

        }
      },
      error: (err) => console.error(err)
    });
    console.log('Rol actualizado:', this.rolSeleccionado.nombre);
  }


  eliminarRol(rol: any) {
    // Verificar permiso para eliminar
    if (!this.permisoModuloService.puede('roles', 'eliminar')) {
      alert('No tienes permiso para eliminar roles');
      return;
    }


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
    // Verificar permiso para crear
    if (!this.permisoModuloService.puede('roles', 'crear')) {
      alert('No tienes permiso para crear roles');
      return;
    }

    this.modoCrearRol = true;
    this.editando = false;
    this.mensajeError = '';

    this.nuevoRol = {
      nombre: ''
    };
  }


  /** Verifica si el rol existe antes de crearlo */
  verificarYCrearRol() {
    const nombreRol = this.nuevoRol.nombre?.trim();

    if (!nombreRol) {
      this.mensajeError = 'El nombre del rol es obligatorio';
      return;
    }

    // Verificar si ya existe un rol con el mismo nombre
    const existe = this.roles.some(rol =>
      rol.nombre.toLowerCase() === nombreRol.toLowerCase()
    );

    if (existe) {
      this.mensajeError = `El rol "${nombreRol}" ya existe. No se puede crear duplicados.`;
      return;
    }
    // Si no existe, proceder a crear
    this.crearNuevoRol();
  }


  crearNuevoRol() {
    const nombreRol = this.nuevoRol.nombre.trim();

    this.rolPermisosService.crearRol({ nombre: nombreRol }).subscribe({
      next: (resp) => {
        console.log('Rol creado:', resp);

        this.modoCrearRol = false;
        this.nuevoRol = { nombre: '' };
        this.mensajeError = '';

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
