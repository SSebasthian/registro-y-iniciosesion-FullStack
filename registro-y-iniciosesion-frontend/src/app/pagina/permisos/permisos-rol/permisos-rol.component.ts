import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { AutenticadorService } from '../../../arquitectura/servicio/autenticador.service';


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

  constructor(
    private dialog: MatDialogRef<PermisosRolComponent>,
    private autenticadorService: AutenticadorService
  ) { }

  ngOnInit() {
    this.cargarRoles();
  }

  nuevoRol: any = {
    nombre: ''
  };


  cargarRoles() {
    this.autenticadorService.obtenerRoles().subscribe({
      next: (data) => {
        this.roles = data;

        // 🔥 traer conteo por cada rol
        this.roles.forEach(rol => {
          this.autenticadorService.contarUsuariosPorRol(rol.id)
            .subscribe(count => {
              rol.usuariosxRol = count;
            });
        });
      }
    });
  }


  editarRol(rol: any) {
    this.rolSeleccionado = { ...rol };
    this.editando = true;
  }


  guardarRol() {
    this.autenticadorService.actualizarRol(
      this.rolSeleccionado.id,
      this.rolSeleccionado
    ).subscribe({
      next: (resp) => {
        this.editando = false;
        this.cargarRoles(); // refrescar lista
      },
      error: (err) => console.error(err)
    });
  }


  eliminarRol(rol: any) {
    if (!confirm(`¿Seguro que quieres eliminar el rol "${rol.nombre}"?`)) {
      return;
    }

    this.autenticadorService.eliminarRol(rol.id).subscribe({
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
    this.autenticadorService.crearRol(this.nuevoRol).subscribe({
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

    this.autenticadorService.obtenerUsuariosPorRol(rol.id).subscribe({
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
