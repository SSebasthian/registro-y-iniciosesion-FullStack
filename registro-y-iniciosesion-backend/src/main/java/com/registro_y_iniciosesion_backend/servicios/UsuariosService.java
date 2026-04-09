package com.registro_y_iniciosesion_backend.servicios;


import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import com.registro_y_iniciosesion_backend.repositorios.UsuariosRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuariosService {

    private final UsuariosRepository usuariosRepository;

    // Inyección del repositorio mediante el constructor
    public UsuariosService(UsuariosRepository usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }

    // Crear o guardar un usuario nuevo
    public Usuarios crear(Usuarios usuario) {
        return usuariosRepository.save(usuario);
    }

    // Buscar usuario por su nombre de usuario (para login después)
    public Usuarios buscarPorUsuario(String usuario) {
        return usuariosRepository.findByUsuario(usuario);
    }

    // Obtener todos los usuarios
    public List<Usuarios> listar() {
        return usuariosRepository.findAll();
    }

    //  Buscar un usuario por su ID
    public Usuarios buscarPorId(Long id) {
        return usuariosRepository.findById(id).orElse(null);
    }

}
