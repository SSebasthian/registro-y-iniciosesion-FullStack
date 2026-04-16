package com.registro_y_iniciosesion_backend.servicios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.repositorios.RolRepository;
import com.registro_y_iniciosesion_backend.repositorios.UsuariosRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;
    private final UsuariosRepository usuariosRepository;

    // Inyección del repositorio mediante el constructor
    public RolService(
            RolRepository rolRepository,
            UsuariosRepository usuariosRepository
    ) {
        this.rolRepository = rolRepository;
        this.usuariosRepository = usuariosRepository;
    }

    // Listar todos los roles existentes
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    // Buscar un rol por su ID //SE PUEDE EDITAR ELIMINAR ETC
    public Rol buscarPorId(Long id) {
        return rolRepository.findById(id).orElse(null);
    }

    // Crear o editar un rol
    public Rol crear(Rol rol) {
        return rolRepository.save(rol);
    }


    //Eliminar rol , si existe usuario con rol (SE BLOQUEA , NO PERMITE)
    public String eliminarRol(Long id) {
        boolean tieneUsuarios = usuariosRepository.existsByRol_Id(id);

        if (tieneUsuarios) {
            return "No se puede eliminar: hay usuarios con este rol";
        }

        rolRepository.deleteById(id);
        return "Rol eliminado correctamente";
    }




    // Agregar un permiso al rol (relación ManyToMany)
    public Rol agregarPermiso(Rol rol, Permisos permiso) {
        rol.getPermisos().add(permiso);     // se agrega el permiso al Set Entidad Rol
        return rolRepository.save(rol);      // se guarda el rol actualizado
    }



}
