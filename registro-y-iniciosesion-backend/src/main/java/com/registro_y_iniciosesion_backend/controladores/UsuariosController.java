package com.registro_y_iniciosesion_backend.controladores;


import com.registro_y_iniciosesion_backend.entidades.Usuarios;
import com.registro_y_iniciosesion_backend.servicios.UsuariosService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    private final UsuariosService usuariosService;

    // Inyección del servicio mediante constructor
    public UsuariosController(UsuariosService usuariosService) {
        this.usuariosService = usuariosService;
    }

    // Crear usuario (POST /usuarios)
    @PostMapping
    public Usuarios crearUsuario(@RequestBody Usuarios usuario) {
        return usuariosService.crear(usuario);
    }

    // Listar usuarios (GET /usuarios)
    @GetMapping
    public List<Usuarios> listarUsuarios() {
        return usuariosService.listar();
    }

    // Buscar por ID (GET /usuarios/{id})
    @GetMapping("/{id}")
    public Usuarios buscarPorId(@PathVariable Long id) {
        return usuariosService.buscarPorId(id);
    }

    // Buscar usuario por nombre (GET /usuarios/buscar/{usuario})
    @GetMapping("/buscar/{usuario}")
    public Usuarios buscarPorUsuario(@PathVariable String usuario) {
        return usuariosService.buscarPorUsuario(usuario);
    }


    //REGISTRAR USUARIO (POST /usuarios/registrar)
    @PostMapping("/registrar")
    public Usuarios registrarUsuario(@RequestBody Usuarios usuario) {
        return usuariosService.crear(usuario);
    }

}



/////////////////////////////////////////////////////////////////////////////////
////////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// 1 . Crear Un Usuario
//     Metodo: POST
//     URL: http://localhost:8080/usuarios
//     Body -> raw -> JSON

//        {
//           "usuario": "admin",
//           "nombre": "Administrador",
//           "clave": "1234",
//           "rol": {
//             "id": 1
//                 }
//       }



// 2. Listar Todos Los Usuarios
//    Metodo: GET
//     URL: http://localhost:8080/usuarios



// 3. Buscar Un Usuarios Por ID
//    Metodo: GET
//    URL: http://localhost:8080/usuarios/1
