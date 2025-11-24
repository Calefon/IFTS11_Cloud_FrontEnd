import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AnalisisResponse, AnalisisData, GraficosResponse } from '../interfaces/analisis.model';

@Injectable({
  providedIn: 'root'
})
export class AnalisisService {
  private apiLinkEncuestas = environment.INQUIRO_API_LINK + '/encuestas';
  private http = inject(HttpClient);

  // Signals
  analisisActual = signal<AnalisisData | null>(null);
  graficosActuales = signal<GraficosResponse | null>(null);
  cargando = signal<boolean>(false);

  // Computed para datos procesados
  insightsProcesados = computed(() => {
    const analisis = this.analisisActual();
    if (!analisis) return [];
    
    return analisis.insights || analisis.analisis?.insights || [];
  });

  temasProcesados = computed(() => {
    const analisis = this.analisisActual();
    if (!analisis) return [];
    
    return analisis.temas_principales || analisis.analisis?.temas_principales || [];
  });

  recomendacionesProcesadas = computed(() => {
    const analisis = this.analisisActual();
    if (!analisis) return [];
    
    return analisis.recomendaciones || analisis.analisis?.recomendaciones || [];
  });

  constructor() {}

  // ✅ Generar análisis (IA o rápido)
  async generarAnalisis(encuestaId: string, tipo: 'rapido' | 'ia' = 'rapido'): Promise<AnalisisResponse> {
    this.cargando.set(true);
    
    try {
      const endpoint = tipo === 'ia' ? 'analizar' : 'analizar-rapido';
      const url = `${this.apiLinkEncuestas}/encuesta/${encuestaId}/${endpoint}`;
      
      console.log('🔍 Solicitando análisis en URL:', url);

      const response = await firstValueFrom(
        this.http.get<AnalisisResponse>(url).pipe(
          catchError(error => {
            console.error('❌ Error HTTP al generar análisis:', error);
            return of({
              success: false,
              mensaje: 'Error en el análisis: ' + error.message,
              error: error.message,
              timestamp: new Date().toISOString(),
              analisis: {} as AnalisisData
            } as any);
          })
        )
      );

      console.log('📊 Respuesta de análisis:', response);

      if (response.success) {
        this.analisisActual.set(response.analisis);
      } else {
        console.warn('⚠️ Análisis no fue exitoso:', response.mensaje);
      }

      this.cargando.set(false);
      return response;

    } catch (error) {
      this.cargando.set(false);
      console.error('❌ Error en generarAnalisis:', error);
      throw error;
    }
  }

  // ✅ Obtener gráficos
  async obtenerGraficos(encuestaId: string): Promise<GraficosResponse> {
    try {
      const url = `${this.apiLinkEncuestas}/encuesta/${encuestaId}/graficos`;
      console.log('📈 Solicitando gráficos en URL:', url);

      const response = await firstValueFrom(
        this.http.get<any>(url).pipe(
          catchError(error => {
            console.error('❌ Error al cargar gráficos:', error);
            return of({
              success: false,
              encuestaId: encuestaId,
              titulo: 'Gráficos no disponibles',
              graficos: {
                participacionGeneral: { 
                  tipo: 'pastel', 
                  titulo: 'Participación General', 
                  datos: [{ label: 'Error', value: 100, color: '#FF0000' }] 
                },
                preguntasRadio: [],
                tendenciasTemporales: { 
                  tipo: 'linea', 
                  titulo: 'Tendencias Temporales', 
                  datos: [] 
                },
                completitud: { 
                  tipo: 'pastel', 
                  titulo: 'Tasa de Completitud', 
                  datos: [{ label: 'Error', value: 100, color: '#FF0000' }] 
                }
              }
            } as GraficosResponse);
          })
        )
      );

      console.log('📊 Respuesta de gráficos:', response);

      if (response.success && response.graficos) {
        const graficosCorregidos = {
          participacionGeneral: response.graficos.participacion || {
            tipo: 'pastel',
            titulo: 'Participación General', 
            datos: []
          },
          preguntasRadio: response.graficos.preguntas || [],
          tendenciasTemporales: response.graficos.tendencias || {
            tipo: 'linea',
            titulo: 'Tendencias Temporales',
            datos: []
          },
          completitud: response.graficos.completitud || {
            tipo: 'pastel',
            titulo: 'Tasa de Completitud',
            datos: []
          }
        };

        const responseCorregido = {
          ...response,
          graficos: graficosCorregidos
        };

        this.graficosActuales.set(responseCorregido);
        return responseCorregido;
      }

      return response;

    } catch (error) {
      console.error('❌ Error en obtenerGraficos:', error);
      throw error;
    }
  }

  // ✅ Obtener estadísticas
  async obtenerEstadisticas(encuestaId: string): Promise<any> {
    try {
      const url = `${this.apiLinkEncuestas}/encuesta/${encuestaId}/estadisticas`;
      console.log('📊 Solicitando estadísticas en URL:', url);

      const response = await firstValueFrom(
        this.http.get<any>(url).pipe(
          catchError(error => {
            console.error('❌ Error al cargar estadísticas:', error);
            return of({
              success: false,
              mensaje: 'Error cargando estadísticas: ' + error.message
            });
          })
        )
      );

      return response;

    } catch (error) {
      console.error('❌ Error en obtenerEstadisticas:', error);
      throw error;
    }
  }

  // ✅ Forzar análisis con IA
  async forzarAnalisisIA(encuestaId: string): Promise<AnalisisResponse> {
    try {
      const url = `${this.apiLinkEncuestas}/encuesta/${encuestaId}/analizar-forzar`;
      console.log('🚀 Forzando análisis IA en URL:', url);

      const response = await firstValueFrom(
        this.http.get<AnalisisResponse>(url).pipe(
          catchError(error => {
            console.error('❌ Error al forzar análisis:', error);
            return of({
              success: false,
              mensaje: 'Error forzando análisis: ' + error.message,
              error: error.message,
              timestamp: new Date().toISOString(),
              analisis: {} as AnalisisData
            } as any);
          })
        )
      );

      if (response.success) {
        this.analisisActual.set(response.analisis);
      }

      return response;

    } catch (error) {
      console.error('❌ Error en forzarAnalisisIA:', error);
      throw error;
    }
  }

  // ✅ Utilidades
  formatearSentimiento(sentimiento: number): string {
    if (sentimiento > 0.6) return 'Muy Positivo';
    if (sentimiento > 0.3) return 'Positivo';
    if (sentimiento > -0.3) return 'Neutral';
    if (sentimiento > -0.6) return 'Negativo';
    return 'Muy Negativo';
  }

  formatearPorcentaje(valor: number): string {
    return `${Math.round(valor)}%`;
  }

  limpiarAnalisis(): void {
    this.analisisActual.set(null);
    this.graficosActuales.set(null);
  }

  esAnalisisTexto(): boolean {
    const analisis = this.analisisActual();
    return !!(analisis?.analisis_texto);
  }

  obtenerEstadoActual() {
    return {
      analisis: this.analisisActual(),
      graficos: this.graficosActuales(),
      cargando: this.cargando(),
      insights: this.insightsProcesados(),
      temas: this.temasProcesados(),
      recomendaciones: this.recomendacionesProcesadas()
    };
  }
}