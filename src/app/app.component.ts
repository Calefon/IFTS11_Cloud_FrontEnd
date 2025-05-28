import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterfazCreacionComponent } from './interfaz-creacion/interfaz-creacion.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InterfazCreacionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'encuestasFrontTest';
}
