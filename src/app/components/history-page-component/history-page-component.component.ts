import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history-page-component',
  standalone: true,
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
  }

  searchSurveyByEmail(email: string) {
    this.encuestaService.cargarEncuestasPorEmail(email);
  }
}