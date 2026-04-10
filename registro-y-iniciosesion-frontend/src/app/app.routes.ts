import { Routes } from '@angular/router';
import { AccesoComponent } from './pagina/autenticacion/acceso/acceso.component';
import { RegistroComponent } from './pagina/autenticacion/registro/registro.component';
import { PerfilComponent } from './pagina/perfil/perfil.component';


export const routes: Routes = [
    {
        path: '',
        component: RegistroComponent
    },
    {
        path: 'autenticacion',
        children:[
                {path: 'acceso',
                component:AccesoComponent
            },
                {path: 'registro',
                component:RegistroComponent
            },
                {path: 'perfil',
                component:PerfilComponent
            }
        ]
    },
    
];
