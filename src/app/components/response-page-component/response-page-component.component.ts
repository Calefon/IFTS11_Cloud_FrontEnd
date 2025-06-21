import { Component, inject, OnInit } from '@angular/core';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { EncuestaResponse, RespuestaEncuesta, RespuestaAPI } from '../../interfaces/encuestaInterface';

@Component({
  selector: 'app-response-page-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-page-component.component.html',
  providers: [DatePipe]
})
export class ResponsePageComponentComponent implements OnInit {
  private encuestaService = inject(EncuestasApiService);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);

  respuestas: RespuestaEncuesta[] = [];
  encuesta: EncuestaResponse | null = null;
  isLoading = false;
  errorMessage = '';
  usingMockData = false;

  ngOnInit() {
    this.cargarDatosEncuesta();
  }

  async cargarDatosEncuesta() {
    this.isLoading = true;
    this.errorMessage = '';
    const pk = this.route.snapshot.paramMap.get('pk');
    const sk = this.route.snapshot.paramMap.get('sk');

    if (!pk || !sk) {
      this.errorMessage = 'Faltan parámetros en la URL';
      this.isLoading = false;
      return;
    }

    try {
      const encuestas = await this.encuestaService.verEncuestas();
      const encuestaEncontrada = encuestas.find(
        (e: any) => e.InquiroPK === pk && e.InquiroSK === sk
      );

      if (!encuestaEncontrada) {
        this.errorMessage = 'No se encontró la encuesta solicitada';
        return;
      }

      this.encuesta = encuestaEncontrada;
      await this.cargarRespuestas(pk, sk);
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Error al cargar los datos de la encuesta';
    } finally {
      this.isLoading = false;
    }
  }

  async cargarRespuestas(pk: string, sk: string) {
    try {
      const respuestasApi: RespuestaAPI[] = await this.encuestaService.verRespuestasEncuesta(pk, sk);

      if (respuestasApi.length > 0 && this.encuesta) {
        this.respuestas = this.encuestaService.transformRespuestas(respuestasApi, this.encuesta);
        this.usingMockData = false;
      } else {
        this.respuestas = this.generarRespuestasMock();
        this.usingMockData = true;
      }
    } catch (error) {
      console.error('Error al cargar respuestas:', error);
      this.respuestas = this.generarRespuestasMock();
      this.usingMockData = true;
    }
  }

  generarRespuestasMock(): RespuestaEncuesta[] {
    if (!this.encuesta) return [];

    return [{
      respuestaId: 'mock-' + Math.random().toString(36).substring(2, 9),
      encuestaId: this.encuesta.InquiroSK,
      fecha: new Date().toISOString(),
      respuestas: this.encuesta.preguntas.reduce((acc, pregunta) => {
        if (pregunta.tipoPregunta === 'abierta') {
          acc[pregunta.pregunta] = 'Respuesta de ejemplo';
        } else if (pregunta.tipoPregunta === 'opciones_radio' && pregunta.opciones?.length) {
          acc[pregunta.pregunta] = pregunta.opciones[0];
        } else if (pregunta.tipoPregunta === 'opciones_checkbox' && pregunta.opciones?.length) {
          acc[pregunta.pregunta] = [pregunta.opciones[0]];
        }
        return acc;
      }, {} as { [key: string]: string | string[] })
    }];
  }

  descargarCSV() {
    if (!this.encuesta || this.respuestas.length === 0) {
      this.errorMessage = 'No hay respuestas para descargar';
      return;
    }

    const filename = `respuestas_${this.encuesta.titulo || 'encuesta'}_${new Date().toISOString().slice(0, 10)}.csv`;
    this.encuestaService.descargarCSV(this.respuestas, this.encuesta, filename);
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }

  mostrarDatosDebug() {
    console.log('Encuesta actual:', this.encuesta);
    console.log('Respuestas cargadas:', this.respuestas);
    console.log('¿Usando mock data?', this.usingMockData);
  }
}
