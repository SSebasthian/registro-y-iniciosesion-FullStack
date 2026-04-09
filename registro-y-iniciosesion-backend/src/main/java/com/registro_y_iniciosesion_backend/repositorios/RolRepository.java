package com.registro_y_iniciosesion_backend.repositorios;

import com.registro_y_iniciosesion_backend.entidades.Rol;
import org.springframework.data.jpa.repository.JpaRepository;


// --------------------------------------------------------
// Esta interfaz es el repositorio encargado de acceder a la tabla
// "rol" en la base de datos mediante Spring Data JPA.
// JpaRepository proporciona automaticamente:
//  - CRUD completo (guardar, buscar, eliminar).
//  - Paginación y ordenamiento.
//  - Consultas personalizadas por nombre del metodo.
// --------------------------------------------------------


public interface RolRepository extends JpaRepository<Rol,Long> {

}
