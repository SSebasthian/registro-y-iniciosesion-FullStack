<h1 align="center"> # Registro-InicioSesion </h1>

## Necesario para Angular
`npm install -g @angular/cli@19`<br>
`ng add @angular/material@19`<br>



## Creación de Proyecto Angular
`ng new registro-y-iniciosesion-frontend` (Se crea con CSS)<br>
`ng generate component pagina/autenticacion/acceso` (Acceso)<br>
`ng generate component pagina/autenticacion/registro` (Registro)<br>
`ng generate service arquitectura/servicio/autenticador` (Servicio Autenticacion)<br>
`Se crea interface inicioSesionSolicitud manualmente` (Interface InicioSesionSolicitud SOLICITUD AUTENTICACION BACKEND)<br>
`Se crea interface inicioSesionRespuesta manualmente` (Interface inicioSesionRespuesta RESPUESTA AUTENTICACION BACKEND)<br>
`ng generate component pagina/perfil` (Perfil)<br>
`ng generate guard arquitectura/guardianRuta/enturamiento` (*)CanActivate (Guardian para Controlar Roles de Acceso)<br>
`ng generate component pagina/permisos/permisos-usuarios` (PERMISOS USUARIOS)<br>
`ng generate component pagina/permisos/permisos-perfil` (PERMISOS PERFIL)<br>
`ng generate component pagina/permisos/permisos-rol` (PERMISOS ROL)<br>
`ng generate component pagina/permisos/permisos-permisos` (PERMISOS PERMISOS)<br>

