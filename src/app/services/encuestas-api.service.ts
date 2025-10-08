import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import type {
  Encuesta,
  EncuestaHistorial,
  EncuestaResponse,
} from '../interfaces/encuestaInterface';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom, of } from 'rxjs';
import { RespuestaAPI,RespuestaEncuesta } from '../interfaces/encuestaInterface';

  
interface Respuesta {
  encuestaId: string;
  fecha: string;
  respuestas: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EncuestasApiService {
  private apiLinkEncuestas = environment.INQUIRO_API_LINK + '/encuestas';
  private apiLinkRespuestas = environment.INQUIRO_API_LINK + '/respuestas';

  private http = inject(HttpClient);

  encuestasHistorial = signal<EncuestaResponse[]>([]);
  encuestasHistorialGrupo = computed<EncuestaResponse[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.encuestasHistorial().length; i += 3) {
      groups.push(this.encuestasHistorial().slice(i, i + 3));
    }
    return groups;
  });

  encuestasFiltradasPorNombre = signal<EncuestaResponse[]>([]);
  encuestasHistorialGrupoNombre = computed<EncuestaResponse[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.encuestasFiltradasPorNombre().length; i += 3) {
      groups.push(this.encuestasFiltradasPorNombre().slice(i, i + 3));
    }
    return groups;
  });


  encuestasFiltradasPorEmail = signal<EncuestaResponse[]>([]);
  encuestasHistorialGrupoEmail = computed<EncuestaResponse[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.encuestasFiltradasPorEmail().length; i += 3) {
      groups.push(this.encuestasFiltradasPorEmail().slice(i, i + 3));
    }
    return groups;
  });

  constructor() {}

  crearEncuesta(encuesta: Encuesta) {
    return this.http.post<EncuestaResponse>(this.apiLinkEncuestas, encuesta);
  }

  async verEncuestas(): Promise<EncuestaResponse[]> {
  const url = 'https://api.inquiro.site/encuestas/all';
  try {
    const response = await firstValueFrom(this.http.get<EncuestaHistorial>(url));
    const mappedEncuestas = response.encuestas.map((encuesta: any) => ({
      InquiroPK: encuesta.InquiroPK,
      InquiroSK: encuesta.InquiroSK,
      titulo: encuesta.titulo,
      preguntas: encuesta.preguntas,
      fechaCreacion: this.formatearFecha(encuesta.fechaCreacion),
    }));
    this.encuestasHistorial.set(mappedEncuestas);
    return mappedEncuestas;
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    return [];
  }
}

 async verRespuestasEncuesta(pk: string, sk: string): Promise<RespuestaAPI[]> {
  try {
    const url = `${this.apiLinkRespuestas}/${sk}`;
    const respuestas = await firstValueFrom(
      this.http.get<RespuestaAPI[]>(url).pipe(
        catchError(error => {
          console.error('Error al cargar respuestas:', error);
          return of([]);
        })
      )
    );
    return respuestas;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}


  transformRespuestas(respuestasApi: RespuestaAPI[], encuesta: EncuestaResponse): RespuestaEncuesta[] {
    return respuestasApi.map(respuesta => ({
      respuestaId: respuesta.respuestasInquiroSK,
      encuestaId: respuesta.respuestasInquiroSK,
      fecha: respuesta.fechaRespuesta,
      respuestas: this.transformarRespuestasIndividuales(respuesta, encuesta)
    }));
  }

  private transformarRespuestasIndividuales(respuestaApi: RespuestaAPI, encuesta: EncuestaResponse): { [key: string]: any } {
    const respuestas: { [key: string]: any } = {};
    
    encuesta.preguntas.forEach(pregunta => {
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

  descargarCSV(respuestas: RespuestaEncuesta[], encuesta: EncuestaResponse, filename: string): void {
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

  formatearFecha(dateISO: string): string {
    const date = new Date(dateISO);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // Ej: "Jun"
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  cargarEncuestasPorNombre(nombre: string) {
    const filtradas = this.encuestasHistorial().filter((encuesta) =>
      encuesta.titulo.toLowerCase().includes(nombre.toLowerCase())
    );
    this.encuestasFiltradasPorNombre.set(filtradas);
  }

  cargarEncuestasPorEmail(email: string) {
    const filtradas = this.encuestasHistorial().filter((encuesta) =>
      encuesta.InquiroPK.toLowerCase().includes(email.toLowerCase())
    );
    this.encuestasFiltradasPorEmail.set(filtradas);
  }
}

