package com.registro_y_iniciosesion_backend.repositorios;

import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;

// --------------------------------------------------------
// Esta interfaz es el repositorio encargado de acceder a la tabla
// "usuarios" en la base de datos mediante Spring Data JPA.
// JpaRepository proporciona automaticamente:
//  - CRUD completo (guardar, buscar, eliminar).
//  - Paginación y ordenamiento.
//  - Consultas personalizadas por nombre del metodo.
// --------------------------------------------------------

public interface UsuariosRepository extends JpaRepository<Usuarios,Long> {

}
