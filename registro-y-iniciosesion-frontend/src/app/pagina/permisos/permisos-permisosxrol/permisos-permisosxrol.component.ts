import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-permisos-permisosxrol',
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, FormsModule, MatTooltipModule],
  templateUrl: './permisos-permisosxrol.component.html',
  styleUrl: './permisos-permisosxrol.component.css'
})
export class PermisosPermisosxrolComponent {

  /** Lista de roles disponibles en el sistema */
  roles: any[] = [
    { id: 1, nombre: 'administrador' },
    { id: 2, nombre: 'usuario' },
    { id: 3, nombre: 'invitado' },
    { id: 4, nombre: 'supervisor' }
  ];


  // Todos los permisos disponibles
  todosLosPermisos: any[] = [
    { id: 1, modulo: 'usuarios', accion: 'ver', asignado: false, rolesAsignados: [] },
    { id: 2, modulo: 'usuarios', accion: 'crear', asignado: false, rolesAsignados: [] },
    { id: 3, modulo: 'usuarios', accion: 'editar', asignado: false, rolesAsignados: [] },
    { id: 4, modulo: 'usuarios', accion: 'eliminar', asignado: false, rolesAsignados: [] },
    { id: 5, modulo: 'roles', accion: 'ver', asignado: false, rolesAsignados: [] },
    { id: 6, modulo: 'roles', accion: 'crear', asignado: false, rolesAsignados: [] },
    { id: 7, modulo: 'roles', accion: 'editar', asignado: false, rolesAsignados: [] },
    { id: 8, modulo: 'roles', accion: 'eliminar', asignado: false, rolesAsignados: [] },
    { id: 9, modulo: 'permisos', accion: 'ver', asignado: false, rolesAsignados: [] },
    { id: 10, modulo: 'permisos', accion: 'crear', asignado: false, rolesAsignados: [] },
    { id: 11, modulo: 'permisos', accion: 'editar', asignado: false, rolesAsignados: [] },
    { id: 12, modulo: 'permisos', accion: 'eliminar', asignado: false, rolesAsignados: [] },
    { id: 13, modulo: 'dashboard', accion: 'ver', asignado: false, rolesAsignados: [] },
    { id: 14, modulo: 'reportes', accion: 'generar', asignado: false, rolesAsignados: [] },
    { id: 15, modulo: 'configuracion', accion: 'ver', asignado: false, rolesAsignados: [] }
  ];

  permisos: any[] = [];
  rolSeleccionado: any = null;
  filtro: string = '';
  hayCambios: boolean = false;

  // Backup para saber qué cambió
  private backupPermisos: Map<number, boolean> = new Map();


  constructor(private dialogRef: MatDialogRef<PermisosPermisosxrolComponent>) {
    // Inicializar permisos vacíos
    this.inicializarRolesAsignados();
    this.permisos = JSON.parse(JSON.stringify(this.todosLosPermisos));
  }


  // ============================================
  // MÉTODOS DE INICIALIZACIÓN 
  // ============================================
  
  inicializarRolesAsignados() {
    // Administrador tiene todos
    this.todosLosPermisos.forEach(p => {
      p.rolesAsignados = [];

      // Simular asignaciones
      if (p.modulo === 'dashboard') {
        p.rolesAsignados = ['administrador', 'usuario', 'supervisor'];
      } else if (p.modulo === 'usuarios' && p.accion === 'ver') {
        p.rolesAsignados = ['administrador', 'usuario', 'supervisor'];
      } else if (p.modulo === 'usuarios' && (p.accion === 'crear' || p.accion === 'editar')) {
        p.rolesAsignados = ['administrador', 'supervisor'];
      } else if (p.modulo === 'usuarios' && p.accion === 'eliminar') {
        p.rolesAsignados = ['administrador'];
      } else if (p.modulo === 'reportes') {
        p.rolesAsignados = ['administrador', 'supervisor'];
      } else if (p.modulo === 'roles' || p.modulo === 'permisos') {
        p.rolesAsignados = ['administrador'];
      } else {
        p.rolesAsignados = ['administrador'];
      }
    });
  }


  // Permisos filtrados por búsqueda
  get permisosFiltrados() {
    if (!this.filtro) return this.permisos;

    return this.permisos.filter(permiso =>
      permiso.modulo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      permiso.accion.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }


  // Obtener SOLO los roles que tienen este permiso
  obtenerRolesConPermiso(permiso: any): any[] {
    if (!permiso.rolesAsignados || permiso.rolesAsignados.length === 0) {
      return [];
    }

    // Filtrar los roles que están en rolesAsignados
    return this.roles.filter(rol =>
      permiso.rolesAsignados.includes(rol.nombre)
    );
  }


  // Obtener nombre corto del rol (primeras 4 letras)
  getNombreCortoRol(nombre: string): string {
    return nombre.substring(0, 3).toUpperCase();
  }

  // Obtener tooltip con nombre completo
  getTooltipRol(nombre: string): string {
    return nombre.toUpperCase();
  }


  // ============================================
  // MÉTODOS PARA ASIGNACIÓN DE PERMISOS (VISTA CON ROL)
  // ============================================

  // Cuando cambia el rol seleccionado
  onRolChange() {
    if (!this.rolSeleccionado) return;

    // Simular carga de permisos según el rol
    // Esto luego vendrá del backend
    this.permisos = JSON.parse(JSON.stringify(this.todosLosPermisos));

    // Simular permisos asignados según el rol
    switch (this.rolSeleccionado.nombre) {
      case 'administrador':
        // Administrador tiene todos los permisos
        this.permisos.forEach(p => p.asignado = true);
        break;
      case 'usuario':
        // Usuario solo tiene permisos básicos
        this.permisos.forEach(p => {
          p.asignado = p.modulo === 'dashboard' ||
            (p.modulo === 'usuarios' && p.accion === 'ver');
        });
        break;
      case 'supervisor':
        // Supervisor tiene permisos de ver y editar en usuarios
        this.permisos.forEach(p => {
          p.asignado = p.modulo === 'dashboard' ||
            p.modulo === 'reportes' ||
            (p.modulo === 'usuarios' && (p.accion === 'ver' || p.accion === 'editar'));
        });
        break;
      default:
        // Invitado no tiene permisos
        this.permisos.forEach(p => p.asignado = false);
        break;
    }

    // Guardar estado original
    this.guardarBackup();
    this.hayCambios = false;
  }


  // Guardar backup del estado actual
  guardarBackup() {
    this.backupPermisos.clear();
    this.permisos.forEach(p => {
      this.backupPermisos.set(p.id, p.asignado);
    });
  }

  // Cuando cambia un toggle
  onToggleChange() {
    // Verificar si hay cambios respecto al backup
    this.hayCambios = this.permisos.some(p =>
      p.asignado !== this.backupPermisos.get(p.id)
    );
  }

}
