import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import type {
  Encuesta,
  EncuestaHistorial,
  EncuestaResponse,
} from '../interfaces/encuestaInterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncuestasApiService {
  private apiLinkEncuestas = environment.INQUIRO_API_LINK + '/encuestas';

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
    this.http
      .post<EncuestaResponse>(this.apiLinkEncuestas, encuesta)
      .subscribe((resp) => {
        console.log('Respuesta: ', resp);

        let idEncuesta = resp.InquiroSK;
        if (idEncuesta) {
          alert(
            `Encuesta creada! idEncuesta: ${idEncuesta}\nLink encuesta: encuestas.inquiro.site/${idEncuesta}`
          );
          console.log(
            `Encuesta creada! idEncuesta: ${idEncuesta}\nLink encuesta: encuestas.inquiro.site/${idEncuesta}`
          );
        }
      });
  }

  verEncuestas() {
    this.http
      .get<EncuestaHistorial>('https://api.inquiro.site/encuestas/all')
      .subscribe((resp) => {
        const mappedEncuestas = resp.encuestas.map((encuesta: any) => ({
          InquiroPK: encuesta.InquiroPK,
          InquiroSK: encuesta.InquiroSK,
          titulo: encuesta.titulo,
          preguntas: encuesta.preguntas,
          fechaCreacion: this.formatearFecha(encuesta.fechaCreacion),
        }));
        this.encuestasHistorial.set(mappedEncuestas);
        console.log(this.encuestasHistorial());
      });
  }

  verRespuestasEncuesta(pk: string, sk: string) {}

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

