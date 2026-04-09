package com.registro_y_iniciosesion_backend.servicios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.repositorios.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;

    // Inyección del repositorio mediante el constructor
    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    // Crear o guardar un rol
    public Rol crear(Rol rol) {
        return rolRepository.save(rol);
    }

    // Agregar un permiso al rol (relación ManyToMany)
    public Rol agregarPermiso(Rol rol, Permisos permiso) {
        rol.getPermisos().add(permiso);     // se agrega el permiso al Set Entidad Rol
        return rolRepository.save(rol);      // se guarda el rol actualizado
    }

    // Listar todos los roles existentes
    public List<Rol> listar() {
        return rolRepository.findAll();
    }

    // Buscar un rol por su ID
    public Rol buscarPorId(Long id) {
        return rolRepository.findById(id).orElse(null);
    }
}
