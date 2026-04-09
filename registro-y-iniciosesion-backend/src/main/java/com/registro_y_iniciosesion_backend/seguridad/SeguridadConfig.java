package com.registro_y_iniciosesion_backend.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SeguridadConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Deshabilitamos CSRF para Postman
                .csrf(csrf -> csrf.disable())

                // Permite que cualquier petición hacia cualquier endpoint sea accesible
                // sin autenticación. Es decir, todo el backend queda publico.
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        // Construye y devuelve la configuración de seguridad.
        return http.build();
    }
}
