import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import {
  EncuestaResponse,
  RespuestaEncuesta,
  RespuestaAPI,
} from '../../interfaces/encuestaInterface';
import { AnalisisService } from '../../services/analisis.service';
import { GraficosResponse } from '../../interfaces/analisis.model';
Chart.register(...registerables);
@Component({
  selector: 'app-response-page-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-page-component.component.html',
  providers: [DatePipe],
})
export class ResponsePageComponentComponent implements OnInit, AfterViewInit {
  private encuestaService = inject(EncuestasApiService);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private analisisService = inject(AnalisisService);
 private cdr = inject(ChangeDetectorRef);

  respuestas: RespuestaEncuesta[] = [];
  encuesta: EncuestaResponse | null = null;
  isLoading = false;
  errorMessage = '';
  analisis: any = null;
  mostrandoAnalisis = false;
  cargandoAnalisis = false;

  graficosResponse: GraficosResponse | null = null;
  mostrandoGraficos = false;
  cargandoGraficos = false;

  @ViewChild('graficoParticipacionCanvas')
  graficoParticipacionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoCompletitudCanvas')
  graficoCompletitudCanvas!: ElementRef<HTMLCanvasElement>;

  graficos: Chart[] = [];

  ngOnInit() {
    this.cargarDatosEncuesta();
  }

  ngAfterViewInit() {
    if (this.mostrandoGraficos && this.graficosResponse) {
      this.renderizarGraficos();
    }
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
    const respuestasApi = await this.encuestaService.verRespuestasEncuesta(pk, sk);
    
    console.log(' RESPUESTAS API COMPLETAS:', respuestasApi);
    console.log(' Tipo:', typeof respuestasApi);
    console.log(' Es array?:', Array.isArray(respuestasApi));
    
    if (respuestasApi && Array.isArray(respuestasApi) && respuestasApi.length > 0) {
      console.log(' Primera respuesta COMPLETA:', JSON.stringify(respuestasApi[0], null, 2));
      console.log(' Keys de la primera respuesta:', Object.keys(respuestasApi[0]));
    }
    
    if (Array.isArray(respuestasApi) && this.encuesta) {
      this.respuestas = [...this.transformRespuestas(respuestasApi)];
      console.log(' Respuestas transformadas:', this.respuestas);
    }
  } catch (error) {
    console.error('Error al cargar respuestas:', error);
    this.errorMessage = 'Error al cargar respuestas.';
  }
}

  async generarAnalisisAutomatico() {
    if (!this.encuesta) return;
    this.cargandoAnalisis = true;
    try {
      const response = await this.analisisService.generarAnalisis(
        this.encuesta.InquiroSK,
        'rapido'
      );
      if (response.success) {
        this.analisis = response.analisis;
        this.mostrandoAnalisis = true;
        console.log(' Análisis automático cargado:', this.analisis);
      }
    } catch (error) {
      console.error('Error en análisis automático:', error);
    } finally {
      this.cargandoAnalisis = false;
    }
  }

  async generarAnalisisIA() {
    if (!this.encuesta) return;
    this.cargandoAnalisis = true;
    try {
      const response = await this.analisisService.generarAnalisis(
        this.encuesta.InquiroSK,
        'ia'
      );
      if (response.success) {
        this.analisis = response.analisis;
        this.mostrandoAnalisis = true;
        console.log(' Análisis IA cargado:', this.analisis);
      }
    } catch (error) {
      console.error('Error en análisis IA:', error);
    } finally {
      this.cargandoAnalisis = false;
    }
  }

  toggleAnalisis() {
    this.mostrandoAnalisis = !this.mostrandoAnalisis;
  }

 async cargarGraficos() {
  if (!this.encuesta) return;
  this.cargandoGraficos = true;

  try {
    const response = await this.analisisService.obtenerGraficos(this.encuesta.InquiroSK);
    if (response.success) {
      this.graficosResponse = response;
      this.mostrandoGraficos = true;

      console.log(' Estructura completa de gráficos:', response.graficos);
      console.log(' Preguntas disponibles:', response.graficos?.preguntas);
      console.log(' Participación:', response.graficos?.participacion);

      //  Forzar detección de cambios para que Angular renderice los canvas
      this.cdr.detectChanges();

      //  Esperar un tick antes de graficar
      setTimeout(() => this.renderizarGraficos(), 100);
    }
  } catch (error) {
    console.error('Error cargando gráficos:', error);
  } finally {
    this.cargandoGraficos = false;
  }
}


  toggleGraficos() {
    this.mostrandoGraficos = !this.mostrandoGraficos;
    if (this.mostrandoGraficos && !this.graficosResponse) {
      this.cargarGraficos();
    } else if (this.mostrandoGraficos && this.graficosResponse) {
      this.renderizarGraficos();
    }
  }

getGraficosData() {
  const g = this.graficosResponse?.graficos;
  if (!g) {
    return {
      participacionGeneral: {
        tipo: 'pie',
        titulo: 'Participación General',
        datos: [{ label: 'Sin datos', value: 100, color: '#9E9E9E' }],
      },
      preguntasRadio: [],
      tendenciasTemporales: {
        tipo: 'line',
        titulo: 'Tendencias',
        datos: [],
      },
    };
  }
  return g;
}
renderizarGraficos() {
  // Destruye gráficos anteriores
  this.graficos.forEach((grafico) => grafico.destroy());
  this.graficos = [];

  const preguntasRadio = this.getPreguntasRadio();

  console.log(' INICIANDO RENDERIZADO DE GRÁFICOS DE PASTEL');
  console.log(' Preguntas radio a renderizar:', preguntasRadio);

  if (preguntasRadio.length === 0) {
    console.log(' No hay preguntas radio para renderizar');
    return;
  }

  // Pequeño delay para asegurar que los canvas estén en el DOM
  setTimeout(() => {
    preguntasRadio.forEach((pregunta, index) => {
      const canvasId = `pastel-${pregunta.preguntaId || index}`;
      this.crearGraficoPastel(canvasId, pregunta, index);
    });
  }, 100);
}

private crearGraficoPastel(canvasId: string, pregunta: any, index: number) {
  const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
  
  console.log(` Buscando canvas ${canvasId}:`, !!canvasElement);
  
  if (!canvasElement) {
    console.log(` Canvas ${canvasId} no encontrado en el DOM`);
    return;
  }

  if (!pregunta.datos || pregunta.datos.length === 0) {
    console.log(` No hay datos para la pregunta ${index}`);
    return;
  }

  try {
    console.log(` Creando gráfico pastel para: ${pregunta.titulo}`, pregunta.datos);
    
    const chart = new Chart(canvasElement, {
      type: 'pie',
      data: {
        labels: pregunta.datos.map((d: any) => d.label),
        datasets: [{
          data: pregunta.datos.map((d: any) => d.value),
          backgroundColor: pregunta.datos.map((d: any, i: number) => 
            d.color || this.getColorPorIndice(i)
          ),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Ya tenemos la leyenda en HTML
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
    
    this.graficos.push(chart);
    console.log(` Gráfico pastel "${pregunta.titulo}" creado exitosamente`);
    
  } catch (error) {
    console.error(` Error creando gráfico pastel ${index}:`, error);
  }
}

// Método público para los colores
getColorPorIndice(index: number): string {
  const colores = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#E11D48'
  ];
  return colores[index % colores.length];
}
// Método para calcular completitud real basada en las respuestas
calcularCompletitudReal(): number {
  if (this.respuestas.length === 0) return 0;
  
  let totalCampos = 0;
  let camposCompletados = 0;

  this.respuestas.forEach(respuesta => {
    Object.values(respuesta.respuestas).forEach(resp => {
      totalCampos++;
      if (resp && resp.toString().trim() !== '') {
        camposCompletados++;
      }
    });
  });

  return totalCampos > 0 ? Math.round((camposCompletados / totalCampos) * 100) : 0;
}

getPreguntasRadio() {
  if (!this.graficosResponse || !this.graficosResponse.graficos?.preguntasRadio) {
    console.log(' No hay preguntas radio en la respuesta');
    return [];
  }

  const preguntasRadio = this.graficosResponse.graficos.preguntasRadio;
  console.log('Todas las preguntas en preguntasRadio:', preguntasRadio);
  
  // Como ya vienen en preguntasRadio, probablemente todas son de tipo radio
  // Pero por si acaso, filtramos por el tipo que tenga cada gráfico
  const preguntasFiltradas = preguntasRadio.filter(
    (pregunta) => {
      const esRadio = 
        pregunta.tipo?.toLowerCase().includes('radio') ||
        pregunta.tipo?.toLowerCase().includes('pastel') ||
        pregunta.tipo?.toLowerCase().includes('pie');
      
      console.log(` Pregunta "${pregunta.titulo}" - tipo: "${pregunta.tipo}" - esRadio: ${esRadio}`);
      return esRadio;
    }
  );

  console.log('Preguntas radio filtradas:', preguntasFiltradas);
  return preguntasFiltradas;
}

  private transformRespuestas(respuestasApi: RespuestaAPI[]): RespuestaEncuesta[] {
  if (!this.encuesta) return [];

  return respuestasApi.map(respuesta => ({
    respuestaId: respuesta.respuestasInquiroSK || this.generarIdTemporal(),
    encuestaId: respuesta.respuestasInquiroPK || this.encuesta?.InquiroSK || 'unknown',
    fecha: respuesta.fechaRespuesta || new Date().toISOString(),
    respuestas: this.transformarRespuestasIndividuales(respuesta)
  }));
}


private transformarRespuestasIndividuales(respuestaApi: RespuestaAPI): { [key: string]: string | string[] } {
  const respuestas: { [key: string]: string | string[] } = {};

  this.encuesta?.preguntas.forEach(pregunta => {
    // Buscamos la respuesta correspondiente a la pregunta actual
    const respuestaEncontrada = respuestaApi.respuestas?.find(
      (r: any) => r.pregunta?.trim() === pregunta.pregunta?.trim()
    );

    // Si no se encontró nada, marcamos explícitamente como 'Sin respuesta'
    if (!respuestaEncontrada || respuestaEncontrada.respuesta == null) {
      respuestas[pregunta.pregunta] = 'Sin respuesta';
      return;
    }

    // Si es de tipo checkbox, aseguramos que siempre sea un array
    if (pregunta.tipoPregunta === 'opciones_checkbox') {
      const valor = respuestaEncontrada.respuesta;
      respuestas[pregunta.pregunta] = Array.isArray(valor)
        ? valor.length > 0 ? valor : ['Sin respuesta']
        : [valor?.toString() || 'Sin respuesta'];
    } 
    // Si es otro tipo, lo convertimos siempre a string legible
    else {
      respuestas[pregunta.pregunta] = respuestaEncontrada.respuesta?.toString().trim() || 'Sin respuesta';
    }
  });

  return respuestas;
}


private generarIdTemporal(): string {
  return `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
    const headers = ['ID Respuesta', 'Fecha', ...encuesta.preguntas.map(p => this.escapeCSVField(p.pregunta))];

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
  getTextoAnalisis() {
  if (!this.analisis) return '';
  
  // Si analisis es string, devolverlo directamente
  if (typeof this.analisis.analisis === 'string') {
    return this.analisis.analisis;
  }
  
  // Si analisis es objeto, buscar el texto
  if (typeof this.analisis.analisis === 'object') {
    return this.analisis.analisis.analisis_texto || 
           this.analisis.analisis.resumen_general ||
           JSON.stringify(this.analisis.analisis, null, 2);
  }
  
  // Si hay analisis_texto directo
  if (this.analisis.analisis_texto) {
    return this.analisis.analisis_texto;
  }
  
  return 'No se pudo cargar el análisis.';
}
}
