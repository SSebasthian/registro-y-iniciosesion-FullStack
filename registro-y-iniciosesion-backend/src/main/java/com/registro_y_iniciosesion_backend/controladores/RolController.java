package com.registro_y_iniciosesion_backend.controladores;


import com.registro_y_iniciosesion_backend.entidades.Permisos;
import com.registro_y_iniciosesion_backend.entidades.Rol;
import com.registro_y_iniciosesion_backend.servicios.PermisosService;
import com.registro_y_iniciosesion_backend.servicios.RolService;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("roles")
public class RolController {


    private final RolService rolService;
    private final PermisosService permisosService;

    // Inyección del servicio mediante constructor
    public RolController(RolService rolService,  PermisosService permisosService) {
        this.rolService = rolService;
        this.permisosService = permisosService;
    }

    // Listar todos los permisos (GET /permisos)
    @GetMapping("/admin")
    public List<Rol> listarRoles() {
        return rolService.listarRoles();
    }

    // Editar Rol
    @PutMapping("/admin/{id}")
    public Rol editarRol(@PathVariable Long id, @RequestBody Rol datos) {
        Rol rol = rolService.buscarPorId(id);
        if (rol == null) return null;
        rol.setNombre(datos.getNombre());
        return rolService.crear(rol);
    }

    //Eliminar Rol
    @DeleteMapping("/admin/{id}")
    public String  eliminarRol(@PathVariable Long id) {
        return rolService.eliminarRol(id);
    }

    // Crear un rol (POST /roles)
    @PostMapping("/admin/registrar")
    public Rol crearRol(@RequestBody Rol rol) {
        return rolService.crear(rol);
    }





    // Buscar un permiso por ID (GET /permisos/{id})
    @GetMapping("/admin/{rolId}")
    public Rol buscarPorId(@PathVariable Long id) {
        return rolService.buscarPorId(id);
    }








    //Filtrar x Nombre
    //@GetMapping("admin/buscar")
    //public List<Rol> buscar(@RequestParam String nombre) {
    //    return rolService.buscarPorNombre(nombre);
    //}












    // Agregar un permiso a un rol
    @PostMapping("/{idRol}/agregar-permiso/{idPermiso}")
    public Rol agregarPermiso(
            @PathVariable Long idRol,           // ID del rol
            @PathVariable Long idPermiso) {     // ID del permiso

        // Buscar el rol y permiso en BD
        Rol rol = rolService.buscarPorId(idRol);
        Permisos permiso = permisosService.buscarPorId(idPermiso);

        // Validar que existan
        if (rol == null || permiso == null) {
            return null; // puedes retornar un ResponseEntity más elegante si quieres
        }

        // Agregar el permiso al rol y guardar
        return rolService.agregarPermiso(rol, permiso);
    }
}



/////////////////////////////////////////////////////////////////////////////////
////////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// 1 . Crear Un Rol
//     Metodo: POST
//     URL: http://localhost:8080/roles
//     Body -> raw -> JSON

//        {
//            "nombre": "Administrador"
//        }


// 2. Listar Todos Los Roles
//    Metodo: GET
//     URL: http://localhost:8080/roles


// 3. Buscar Un Rol Por ID
//    Metodo: GET
//    URL: http://localhost:8080/roles/1



// 4. Agregar Permiso a Un ROl
//    Metodo: POST
//    URL: http://localhost:8080/roles/1/agregar-permiso/1


/////////////////////////////////////////////////////////////////////////////////

