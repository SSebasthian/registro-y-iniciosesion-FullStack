import { Routes } from '@angular/router';
import { AccesoComponent } from './pagina/autenticacion/acceso/acceso.component';


export const routes: Routes = [
    {
        path: '',
        component: AccesoComponent
    },
    {
        path: 'acceso',
        component: AccesoComponent
    }
];
