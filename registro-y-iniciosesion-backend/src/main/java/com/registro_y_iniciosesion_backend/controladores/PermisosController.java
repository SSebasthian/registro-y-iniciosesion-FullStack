package com.registro_y_iniciosesion_backend.controladores;

import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.servicios.PermisosService;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/permisos")
public class PermisosController {

    private final PermisosService permisosService;

    // Inyección del servicio mediante constructor
    public PermisosController(PermisosService permisosService) {
        this.permisosService = permisosService;
    }

    // Crear un permiso (POST /permisos)
    @PostMapping
    // @RequestBody: indica que Spring debe tomar los datos del JSON del cuerpo de la petición
    public Permisos crearPermiso(@RequestBody Permisos permiso) {
        return permisosService.crear(permiso);
    }

    // Listar todos los permisos (GET /permisos)
    @GetMapping
    public List<Permisos> listarPermisos() {
        return permisosService.listar();
    }

    // Buscar un permiso por ID (GET /permisos/{id})
    @GetMapping("/{id}")
    // @PathVariable: indica que el valor de {id} en la URL se asigna al parámetro id
    public Permisos buscarPorId(@PathVariable Long id) {
        return permisosService.buscarPorId(id);
    }
}




/////////////////////////////////////////////////////////////////////////////////
////////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// 1 . Crear Un Permiso
//     Metodo: POST
//     URL: http://localhost:8080/permisos
//     Body -> raw -> JSON

//        {
//            "nombre": "inventario_equipos"
//        }


// 2. Listar Todos Los Permisos
//    Metodo: GET
//     URL: http://localhost:8080/permisos


// 3. Buscar Un Permiso Por ID
//    Metodo: GET
//    URL: http://localhost:8080/permisos/1


/////////////////////////////////////////////////////////////////////////////////

