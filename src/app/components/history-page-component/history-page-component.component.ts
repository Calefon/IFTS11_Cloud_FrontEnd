import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { RouterLink } from '@angular/router';
import { EncuestaHistorial, EncuestaResponse } from '../../interfaces/encuestaInterface';

@Component({
  selector: 'app-history-page-component',
  imports: [RouterLink],
  templateUrl: './history-page-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponentComponent {
  encuestaService = inject(EncuestasApiService);

  constructor() {
    this.encuestaService.verEncuestas();
  }

  searchSurveyByName(name: string) {
    this.encuestaService.cargarEncuestasPorNombre(name);
    console.log(this.encuestaService.encuestasFiltradasPorNombre());

    // if(this.encuestaService.encuestasFiltradasPorNombre().length === 0) {
    //   this.encuestaService.encuestasFiltradasPorNombre.set([])
    //   this.encuestaService.verEncuestas();
    // }
  }

  searchSurveyByEmail(email: string) {
    this.encuestaService.cargarEncuestasPorEmail(email);
    console.log(this.encuestaService.encuestasFiltradasPorEmail());
  }
}
