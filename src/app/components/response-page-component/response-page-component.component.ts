import { Component, inject, OnInit } from '@angular/core';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
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
      // Usamos directamente una promesa
      const encuestas = await this.encuestaService.verEncuestas();

      const encuestaEncontrada = encuestas.find(
        (e: EncuestaResponse) => e.InquiroPK === pk && e.InquiroSK === sk
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
      // Usamos directamente una promesa
      const respuestasApi = await this.encuestaService.verRespuestasEncuesta(pk, sk);

      if (Array.isArray(respuestasApi) && respuestasApi.length > 0 && this.encuesta) {
        this.respuestas = this.transformRespuestas(respuestasApi);
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

  private transformRespuestas(respuestasApi: RespuestaAPI[]): RespuestaEncuesta[] {
    if (!this.encuesta) return [];

    return respuestasApi.map(respuesta => ({
      respuestaId: respuesta.respuestasInquiroSK,
      encuestaId: respuesta.respuestasInquiroSK,
      fecha: respuesta.fechaRespuesta,
      respuestas: this.transformarRespuestasIndividuales(respuesta)
    }));
  }

  private transformarRespuestasIndividuales(respuestaApi: RespuestaAPI): { [key: string]: any } {
    const respuestas: { [key: string]: any } = {};

    this.encuesta?.preguntas.forEach(pregunta => {
      const respuestaEncontrada = respuestaApi.respuestas.find(r => r.pregunta === pregunta.pregunta);

      if (pregunta.tipoPregunta === 'opciones_checkbox') {
        respuestas[pregunta.pregunta] = Array.isArray(respuestaEncontrada?.respuesta)
          ? respuestaEncontrada?.respuesta
          : [respuestaEncontrada?.respuesta].filter(Boolean);
      } else {
        respuestas[pregunta.pregunta] = respuestaEncontrada?.respuesta || '';
      }
    });

    return respuestas;
  }

  generarRespuestasMock(): RespuestaEncuesta[] {
    if (!this.encuesta) return [];

    const respuestasIniciales: { [key: string]: string | string[] } = {};

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
      }, respuestasIniciales)
    }];
  }

  descargarCSV() {
    if (!this.encuesta || this.respuestas.length === 0) {
      this.errorMessage = 'No hay respuestas para descargar';
      return;
    }

    const filename = `respuestas_${this.encuesta.titulo || 'encuesta'}_${new Date().toISOString().slice(0, 10)}.csv`;
    this.downloadCSVLocal(this.respuestas, this.encuesta, filename);
  }

  private downloadCSVLocal(respuestas: RespuestaEncuesta[], encuesta: EncuestaResponse, filename: string): void {
    const headers = ['ID Respuesta', 'Fecha', ...encuesta.preguntas.map(p => p.pregunta)];

    const rows = respuestas.map(respuesta => {
      return [
        respuesta.respuestaId,
        respuesta.fecha,
        ...encuesta.preguntas.map(pregunta => {
          const respuestaPregunta = respuesta.respuestas[pregunta.pregunta];
          return this.formatCSVField(respuestaPregunta, pregunta.tipoPregunta);
        })
      ];
    });

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(field => this.escapeCSVField(field)).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private formatCSVField(value: any, tipoPregunta: string): string {
    if (tipoPregunta === 'opciones_checkbox' && Array.isArray(value)) {
      return value.join('; ');
    }
    return value?.toString() || '';
  }

  private escapeCSVField(field: any): string {
    if (typeof field === 'string') {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return `"${field}"`;
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
