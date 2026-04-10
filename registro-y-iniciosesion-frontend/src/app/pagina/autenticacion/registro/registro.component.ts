import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { RouterLink, RouterModule } from "@angular/router";




@Component({
  selector: 'app-registro',
  imports: [MatIconModule, RouterLink,RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

}
