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
import { MatSelectModule } from '@angular/material/select';
import { PermisosPermisosService } from '../../../arquitectura/servicio/permisos/permisos-permisos.service';


@Component({
  selector: 'app-permisos-permisos',
  imports: [CommonModule, MatIconModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormsModule, MatDialogModule, MatSelectModule, MatAutocompleteModule],
  templateUrl: './permisos-permisos.component.html',
  styleUrl: './permisos-permisos.component.css'
})
export class PermisosPermisosComponent implements OnInit {

  // ============================================
  // VARIABLES DE ESTADO DE LA VISTA
  // ============================================
  filtro: string = '';
  permisoSeleccionado: any = null;
  editando: boolean = false;
  modoCrearPermiso: boolean = false;
  verPermisosxRol: boolean = false;

  // ============================================
  // DATOS PRINCIPALES
  // ============================================
  permisos: any[] = [];
  rolesPorPermiso: any[] = [];

  // ============================================
  // DATOS PARA SELECTORES DE MÓDULOS Y ACCIONES
  // ============================================
  modulosDisponibles: string[] = [];
  accionesDisponibles: string[] = [];
  accionesDisponiblesEditar: string[] = [];

  // ============================================
  // VARIABLES AUXILIARES
  // ============================================
  moduloSeleccionado: string = '';
  accionSeleccionada: string = '';
  mensajeError: string = '';
  errorNuevaAccion: string = '';

  // ============================================
  // VARIABLES PARA AUTOCOMPLETADO
  // ============================================
  modulosFiltradosNuevos: string[] = [];
  accionesDisponiblesPorModulo: string[] = [];
  buscarModuloNuevoActivo: boolean = false;
  buscarAccionActivo: boolean = false;

  modulosFiltradosNuevosEditar: string[] = [];
  accionesDisponiblesPorModuloEditar: string[] = [];
  buscarModuloNuevoEditarActivo: boolean = false;
  buscarAccionEditarActivo: boolean = false;




  // ============================================
  // OBJETO PARA NUEVO PERMISO
  // ============================================
  nuevoPermiso: any = {
    modulo: '',
    accion: '',
    moduloNuevo: '',
    accionNueva: ''
  };


  // ============================================
  // CONSTRUCTOR
  // ============================================
  constructor(
    private dialog: MatDialogRef<PermisosPermisosComponent>,
    private permisosPermisosService: PermisosPermisosService,
  ) { }


  // ============================================
  // INICIALIZACIÓN DEL COMPONENTE
  // ============================================
  ngOnInit() {
    this.cargarListaPermisos();
    this.cargarModulos();
  }

  obtenerModuloActual(): string {
    if (this.nuevoPermiso.modulo === 'otro' && this.nuevoPermiso.moduloNuevo) {
      return this.limpiarTexto(this.nuevoPermiso.moduloNuevo);
    } else if (this.nuevoPermiso.modulo && this.nuevoPermiso.modulo !== 'otro') {
      return this.limpiarTexto(this.nuevoPermiso.modulo);
    }
    return '';
  }

  /** Verifica si la nueva acción ya existe con el módulo actual */
  verificarNuevaAccion() {
    const accionNueva = this.nuevoPermiso.accionNueva;

    if (!accionNueva || accionNueva.trim() === '') {
      this.errorNuevaAccion = '';
      return;
    }

    const moduloActual = this.obtenerModuloActual();

    if (!moduloActual) {
      this.errorNuevaAccion = 'Primero selecciona o crea un módulo';
      return;
    }

    const accionLimpia = this.limpiarTexto(accionNueva);
    const moduloLimpio = moduloActual;

    // Buscar si ya existe un permiso con este módulo + acción
    const existe = this.permisos.some(permiso =>
      permiso.modulo === moduloLimpio &&
      permiso.accion === accionLimpia
    );

    if (existe) {
      this.errorNuevaAccion = `❌ La acción "${accionLimpia}" ya existe para el módulo "${moduloLimpio}"`;
    } else {
      this.errorNuevaAccion = '';
    }
  }

  // ============================================
  // MÉTODOS DE CARGA DE DATOS
  // ============================================



  /** Cargar la lista de permisos desde el backend */
  cargarListaPermisos() {
    this.permisosPermisosService.obtenerPermisos().subscribe({
      next: (data) => {
        // Ordenar los permisos por ID de menor a mayor
        this.permisos = data.sort((a, b) => a.id - b.id);
        console.log('Se Listan los Permisos:');
      },
      error: (err) => console.error('Error al cargar permisos:', err)
    });
  }

  /** Carga los módulos únicos para los selectores */
  cargarModulos() {
    this.permisosPermisosService.obtenerModulos().subscribe({
      next: (data) => {
        this.modulosDisponibles = data;
      },
      error: (err) => console.error(err)
    });
  }



  // ============================================
  // MÉTODOS PARA CREAR PERMISO
  // ============================================


  /** Abre el formulario para crear un nuevo permiso */
  crearPermisos() {
    this.modoCrearPermiso = true;
    this.editando = false;
    this.verPermisosxRol = false;
    this.mensajeError = '';

    this.nuevoPermiso = {
      modulo: '',
      accion: '',
      moduloNuevo: '',
      accionNueva: ''
    };
  }


  /** Verifica si el permiso existe antes de crearlo */
  verificarYCrearPermiso() {
    if (!this.nuevoPermiso.modulo || !this.nuevoPermiso.accion) {
      this.mensajeError = 'Complete módulo y acción';
      return;
    }

    this.permisosPermisosService.verificarPermiso(
      this.nuevoPermiso.modulo,
      this.nuevoPermiso.accion
    ).subscribe({
      next: (resp) => {
        if (resp.existe) {
          this.mensajeError = `El Permiso "${this.nuevoPermiso.modulo} - ${this.nuevoPermiso.accion}" Ya Existe`;
        } else {
          this.crearNuevoPermiso();
        }
      },
      error: (err) => console.error(err)
    });
  }


  /** Crea un nuevo permiso en el backend */
  crearNuevoPermiso() {
    // Preparar los datos antes de enviar
    let moduloFinal = this.nuevoPermiso.modulo;
    let accionFinal = this.nuevoPermiso.accion;

    if (this.nuevoPermiso.modulo === 'otro' && this.nuevoPermiso.moduloNuevo) {
      moduloFinal = this.nuevoPermiso.moduloNuevo;
    }

    if (this.nuevoPermiso.accion === 'otro' && this.nuevoPermiso.accionNueva) {
      accionFinal = this.nuevoPermiso.accionNueva;
    }

    moduloFinal = this.limpiarTexto(moduloFinal);
    accionFinal = this.limpiarTexto(accionFinal);

    if (!moduloFinal || !accionFinal) {
      this.mensajeError = 'Módulo y acción no pueden estar vacíos';
      return;
    }

    const permisoData = {
      modulo: moduloFinal,
      accion: accionFinal
    };

    this.permisosPermisosService.crearPermisoSiNoExiste(permisoData).subscribe({
      next: (resp) => {
        if (resp.creado) {
          this.modoCrearPermiso = false;
          this.nuevoPermiso = {
            modulo: '',
            accion: '',
            moduloNuevo: '',
            accionNueva: ''
          };
          this.cargarListaPermisos();
          this.cargarModulos();

          alert(resp.mensaje);
        } else {
          alert(resp.mensaje);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear permiso');
      }
    });
  }





  // ============================================
  // MÉTODOS PARA EDITAR PERMISO
  // ============================================

  /** Abre el formulario para editar un permiso existente */
  editarPermiso(permiso: any) {
    this.permisoSeleccionado = {
      ...permiso,
      moduloOriginal: permiso.modulo,
      accionOriginal: permiso.accion,
      moduloNuevo: '',
      accionNueva: ''
    };
    this.editando = true;
    this.modoCrearPermiso = false;
    this.verPermisosxRol = false;
    this.mensajeError = '';


    // Cargar acciones disponibles para el módulo actual
    if (permiso.modulo) {
      this.permisosPermisosService.obtenerAccionesPorModulo(permiso.modulo).subscribe({
        next: (data) => {
          this.accionesDisponiblesEditar = data;
        },
        error: (err) => console.error(err)
      });
    }
  }



  /** Guarda los cambios del permiso editado */
  guardarPermiso() {
    let moduloFinal = this.permisoSeleccionado.modulo;
    let accionFinal = this.permisoSeleccionado.accion;

    // Si seleccionó "otro" y escribió un nuevo módulo
    if (this.permisoSeleccionado.modulo === 'otro' && this.permisoSeleccionado.moduloNuevo) {
      moduloFinal = this.permisoSeleccionado.moduloNuevo;
    }

    // Si seleccionó "otro" y escribió una nueva acción
    if (this.permisoSeleccionado.accion === 'otro' && this.permisoSeleccionado.accionNueva) {
      accionFinal = this.permisoSeleccionado.accionNueva;
    }

    if (!moduloFinal || !accionFinal) {
      this.mensajeError = 'Complete Modulo y Accion';
      return;
    }

    // Verificar si el nuevo permiso ya existe (solo si cambió módulo o acción)
    if (moduloFinal !== this.permisoSeleccionado.moduloOriginal ||
      accionFinal !== this.permisoSeleccionado.accionOriginal) {

      this.permisosPermisosService.verificarPermiso(moduloFinal, accionFinal).subscribe({
        next: (resp) => {
          if (resp.existe) {
            // Error fijo - NO se elimina automáticamente
            this.mensajeError = `El Permiso "${moduloFinal} - ${accionFinal}" Ya Existe`;
            // No hay setTimeout, el error se queda hasta que el usuario cambie algo
          } else {
            this.actualizarPermiso(moduloFinal, accionFinal);
          }
        },
        error: (err) => console.error(err)
      });
    } else {
      // No hubo cambios, guardar directamente
      this.actualizarPermiso(moduloFinal, accionFinal);
    }
  }


  /** Actualiza el permiso en el backend */
  actualizarPermiso(modulo: string, accion: string) {
    const moduloLimpio = this.limpiarTexto(modulo);
    const accionLimpia = this.limpiarTexto(accion);

    const permisoActualizado = {
      id: this.permisoSeleccionado.id,
      modulo: moduloLimpio,
      accion: accionLimpia
    };

    this.permisosPermisosService.actualizarPermiso(
      this.permisoSeleccionado.id,
      permisoActualizado
    ).subscribe({
      next: (resp) => {
        this.editando = false;
        this.cargarListaPermisos();
        this.cargarModulos();
        this.permisoSeleccionado = null;
        
        alert('Permiso actualizado correctamente');

        
      },
      error: (err) => console.error(err)
    });
  }



  // ============================================
  // MÉTODOS PARA ELIMINAR PERMISO
  // ============================================


  /** Elimina un permiso del sistema */
  eliminarPermiso(permiso: any) {
    if (!confirm(`¿Seguro que quieres eliminar el permiso "${permiso.modulo} - ${permiso.accion}"?`)) {
      return;
    }

    this.permisosPermisosService.eliminarPermiso(permiso.id).subscribe({
      next: (mensaje: String) => {
        alert(mensaje);
        console.log(mensaje);
        this.cargarListaPermisos(); // refresca la lista
        this.cargarModulos();
      },
      error: (err) => {
        console.log("ERROR COMPLETO:", err);
        alert("Error eliminando permiso");
      }
    });
  }



  // ============================================
  // MÉTODOS PARA VER ROLES POR PERMISO
  // ============================================

  /** Muestra los roles que tienen asignado este permiso */
  verRolesPorPermiso(permiso: any) {
    this.permisoSeleccionado = permiso;
    this.verPermisosxRol = true;
    this.editando = false;
    this.modoCrearPermiso = false;

    this.permisosPermisosService.obtenerRolesPorPermiso(permiso.id).subscribe({
      next: (data) => {
        this.rolesPorPermiso = data;
      },
      error: (err) => console.error(err)
    });
  }


  /** Vuelve a la lista de permisos desde la vista de roles */
  volverListaPermisos() {
    this.verPermisosxRol = false;
    this.permisoSeleccionado = null;
    this.rolesPorPermiso = [];
  }



  // ============================================
  // MÉTODOS PARA SELECTORES (Módulos y Acciones)
  // ============================================

  /** Maneja el cambio de módulo en el formulario de creación */
  onModuloChange(modulo: string) {
    this.moduloSeleccionado = modulo;
    this.accionSeleccionada = '';
    this.accionesDisponibles = [];

    if (modulo) {
      this.permisosPermisosService.obtenerAccionesPorModulo(modulo).subscribe({
        next: (data) => {
          this.accionesDisponibles = data;
        },
        error: (err) => console.error(err)
      });
    }
  }

  /** Maneja el cambio de módulo en el formulario de edición */
  onModuloChangeEditar(modulo: string) {
    if (modulo && modulo !== 'otro') {
      this.permisosPermisosService.obtenerAccionesPorModulo(modulo).subscribe({
        next: (data) => {
          this.accionesDisponiblesEditar = data;
        },
        error: (err) => console.error(err)
      });
    } else if (modulo === 'otro') {
      this.accionesDisponiblesEditar = [];
    }
  }




  // ============================================
  // MÉTODOS DE LIMPIEZA DE ERRORES
  // ============================================

  limpiarError() {
    this.mensajeError = '';
  }



  // ============================================
  // MÉTODOS DE UTILIDAD
  // ============================================

  /** Filtra los permisos según el texto de búsqueda */
  get permisosFiltrados() {
    if (!this.filtro) return this.permisos;

    return this.permisos.filter(permiso =>
      permiso.modulo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      permiso.accion.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }


  /** Cancela la acción actual o cierra el diálogo */

  accionCancelar() {
    if (!this.editando && !this.modoCrearPermiso) {
      this.dialog.close();
      return;
    }
    this.editando = false;
    this.modoCrearPermiso = false;
    this.permisoSeleccionado = null;
    this.mensajeError = '';
  }


  limpiarTexto(texto: string): string {
    if (!texto) return '';

    return texto
      .toLowerCase()                    // Convertir a minúsculas
      .trim()                           // Eliminar espacios al inicio y final
      .replace(/\s+/g, '_')             // Reemplazar espacios internos con _
      .replace(/[áäâà]/g, 'a')          // Reemplazar vocales acentuadas
      .replace(/[éëêè]/g, 'e')
      .replace(/[íïîì]/g, 'i')
      .replace(/[óöôò]/g, 'o')
      .replace(/[úüûù]/g, 'u')
      .replace(/[ñ]/g, 'n')             // Reemplazar ñ
      .replace(/[^a-z0-9_]/g, '');      // Eliminar caracteres especiales
  }




  // ============================================
  // MÉTODOS PARA AUTOCOMPLETADO
  // ============================================


  /** Filtra módulos existentes mientras escribe en "Nuevo Módulo" */
  filtrarModulosNuevos() {
    const texto = this.nuevoPermiso.moduloNuevo?.toLowerCase() || '';
    this.buscarModuloNuevoActivo = texto.length > 0;
    console.log('Buscando módulos:', texto);

    if (texto.length > 0) {
      // Filtrar módulos existentes que coincidan con lo que escribe
      this.modulosFiltradosNuevos = this.modulosDisponibles
        .filter(modulo => modulo.toLowerCase().includes(texto))
        .slice(0, 10); // Máximo 10 sugerencias
    } else {
      this.modulosFiltradosNuevos = [];
    }
  }


  /** Filtra acciones existentes para el módulo actual */
  filtrarAccionesPorModulo() {
    const texto = this.nuevoPermiso.accionNueva?.toLowerCase() || '';
    this.buscarAccionActivo = texto.length > 0;

    if (!texto.length) {
      this.accionesDisponiblesPorModulo = [];
      this.errorNuevaAccion = '';
      return;
    }

    const moduloActual = this.obtenerModuloActual();

    if (!moduloActual) {
      this.accionesDisponiblesPorModulo = [];
      return;
    }

    // Obtener acciones únicas que ya existen para este módulo
    const accionesExistentes = this.permisos
      .filter(p => p.modulo === moduloActual)
      .map(p => p.accion);

    // Filtrar acciones que coinciden con lo que escribe el usuario
    const accionesUnicas = [...new Set(accionesExistentes)];
    this.accionesDisponiblesPorModulo = accionesUnicas
      .filter(accion => accion.toLowerCase().includes(texto))
      .sort();

    // Verificar si la acción exacta ya existe
    const accionLimpia = this.limpiarTexto(texto);
    const yaExiste = accionesExistentes.some(a => a === accionLimpia);

    if (yaExiste && texto.trim() !== '') {
      this.errorNuevaAccion = `❌ La acción "${accionLimpia}" ya existe para el módulo "${moduloActual}"`;
    } else {
      this.errorNuevaAccion = '';
    }
  }

  /** Verifica si una acción ya existe en el módulo actual */
  existeAccionEnModulo(accion: string): boolean {
    // Obtener el módulo actual
    let moduloActual = '';

    if (this.nuevoPermiso.modulo === 'otro' && this.nuevoPermiso.moduloNuevo) {
      moduloActual = this.limpiarTexto(this.nuevoPermiso.moduloNuevo);
    } else if (this.nuevoPermiso.modulo && this.nuevoPermiso.modulo !== 'otro') {
      moduloActual = this.limpiarTexto(this.nuevoPermiso.modulo);
    }

    if (!moduloActual) return false;

    return this.permisos.some(p =>
      p.modulo === moduloActual &&
      p.accion === accion
    );
  }



  // ============================================
  // MÉTODOS PARA AUTOCOMPLETADO - EDITAR
  // ============================================

  /** Obtiene el módulo actual en edición */
  obtenerModuloActualEditar(): string {
    if (this.permisoSeleccionado?.modulo === 'otro' && this.permisoSeleccionado?.moduloNuevo) {
      return this.limpiarTexto(this.permisoSeleccionado.moduloNuevo);
    } else if (this.permisoSeleccionado?.modulo && this.permisoSeleccionado?.modulo !== 'otro') {
      return this.limpiarTexto(this.permisoSeleccionado.modulo);
    }
    return '';
  }

  /** Filtra módulos existentes mientras escribe en "Nuevo Módulo" (edición) */
  filtrarModulosNuevosEditar() {
    const texto = this.permisoSeleccionado?.moduloNuevo?.toLowerCase() || '';
    this.buscarModuloNuevoEditarActivo = texto.length > 0;

    if (texto.length > 0) {
      this.modulosFiltradosNuevosEditar = this.modulosDisponibles
        .filter(modulo => modulo.toLowerCase().includes(texto))
        .slice(0, 10);
    } else {
      this.modulosFiltradosNuevosEditar = [];
    }
  }

  /** Filtra acciones existentes para el módulo actual (edición) */
  filtrarAccionesPorModuloEditar() {
    const texto = this.permisoSeleccionado?.accionNueva?.toLowerCase() || '';
    this.buscarAccionEditarActivo = texto.length > 0;

    if (!texto.length) {
      this.accionesDisponiblesPorModuloEditar = [];
      return;
    }

    const moduloActual = this.obtenerModuloActualEditar();

    if (!moduloActual) {
      this.accionesDisponiblesPorModuloEditar = [];
      return;
    }

    // Obtener acciones únicas que ya existen para este módulo
    const accionesExistentes = [...new Set(
      this.permisos
        .filter(p => p.modulo === moduloActual)
        .map(p => p.accion)
    )];

    // Filtrar acciones que coinciden con lo que escribe el usuario
    this.accionesDisponiblesPorModuloEditar = accionesExistentes
      .filter(accion => accion.toLowerCase().includes(texto))
      .slice(0, 10);

    // Verificar si la acción exacta ya existe
    const accionLimpia = this.limpiarTexto(texto);
    const yaExiste = accionesExistentes.some(a => a === accionLimpia);

    if (yaExiste && texto.trim() !== '') {
      this.mensajeError = `❌ La acción "${accionLimpia}" ya existe para el módulo "${moduloActual}"`;
    } else {
      this.mensajeError = '';
    }
  }

  /** Verifica si una acción ya existe en el módulo actual (edición) */
  existeAccionEnModuloEditar(accion: string): boolean {
    const moduloActual = this.obtenerModuloActualEditar();
    if (!moduloActual) return false;

    return this.permisos.some(p =>
      p.modulo === moduloActual &&
      p.accion === accion
    );
  }






}
