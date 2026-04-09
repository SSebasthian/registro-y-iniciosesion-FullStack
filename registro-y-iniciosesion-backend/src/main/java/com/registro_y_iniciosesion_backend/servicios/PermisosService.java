package com.registro_y_iniciosesion_backend.servicios;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.repositorios.PermisosRepository;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class PermisosService {

    private final PermisosRepository permisosRepository;

    // Inyección del repositorio mediante el constructor
    public PermisosService(PermisosRepository permisosRepository) {
        this.permisosRepository = permisosRepository;
    }

    // Crear un nuevo permiso
    public Permisos crear(Permisos permiso){
        return permisosRepository.save(permiso);
    }

    // Listar todos los permisos
    public List<Permisos> listar() {
        return permisosRepository.findAll();
    }

    // Buscar un permiso por su ID
    public Permisos buscarPorId(Long id) {
        return permisosRepository.findById(id).orElse(null);  // devuelve null si no lo encuentra
    }
}
