import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { RouterLink, RouterModule } from "@angular/router";


@Component({
  selector: 'app-acceso',
  imports: [MatIconModule, RouterLink, RouterModule],
  templateUrl: './acceso.component.html',
  styleUrl: './acceso.component.css'
})
export class AccesoComponent {

}
