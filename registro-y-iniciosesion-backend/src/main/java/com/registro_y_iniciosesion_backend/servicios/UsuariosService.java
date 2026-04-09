package com.registro_y_iniciosesion_backend.servicios;


import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import com.registro_y_iniciosesion_backend.repositorios.UsuariosRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuariosService {

    private final UsuariosRepository usuariosRepository;
    private final PasswordEncoder codificarClave;

    // Inyección del repositorio mediante el constructor
    public UsuariosService(UsuariosRepository usuariosRepository,  PasswordEncoder codificarClave) {
        this.usuariosRepository = usuariosRepository;
        this.codificarClave = codificarClave;
    }

    // Crear o guardar un usuario nuevo
    // Se encripta la contraseña
    public Usuarios crear(Usuarios usuario) {
        usuario.setClave(codificarClave.encode(usuario.getClave()));
        // Asegurarnos de que activo sea true por defecto
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
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
