
export interface AnalisisResponse {
  success: boolean;
  mensaje: string;
  analisis: AnalisisData;
  timestamp: string;
  error?: string; // Para respuestas de error
}


export interface AnalisisData {
  encuestaId: string;
  tituloEncuesta: string;
  totalRespuestas: number;
  fechaAnalisis?: string;
  resumen_general?: string;
  sentimiento_promedio?: number;
  temas_principales?: string[];
  insights?: Insight[];
  recomendaciones?: string[];
  analisis_texto?: string; 
  metricas?: Metricas;
  tendencias?: Tendencias;
  analisis?: any; // Para análisis rápido anidado
  metadata?: Metadata;
  desdeCache?: boolean; // Para saber si viene de cache
}

export interface Insight {
  titulo: string;
  descripcion: string;
  tipo: 'positivo' | 'negativo' | 'neutral' | 'sugerencia';
}

// Interfaces para las métricas (más específicas que 'any')
export interface Metricas {
  participacion?: Participacion;
  tiposPreguntas?: { [key: string]: number };
  completitud?: number;
}

export interface Participacion {
  total: number;
  porPregunta?: { [key: string]: number };
}

export interface Tendencias {
  respuestasRecientes?: number;
  horarioPico?: string;
  duracionPromedio?: string;
}

export interface Metadata {
  proveedor?: string;
  version?: string;
  costoAproximado?: string;
  tiempoProcesamiento?: string;
  tipo?: string;
  sin_ia?: boolean;
}

// Para la respuesta de gráficos
export interface GraficosResponse {
  success: boolean;
  encuestaId: string;
  titulo: string;
  graficos: GraficosData;
}

export interface GraficosData {
  // opcionales porque no siempre vienen todas las secciones
  participacion?: Grafico;
  preguntas?: Grafico[];          // preguntas por tipo (radio, escala, etc.)
  tendencias?: Grafico;
  completitud?: Grafico;
  // mantienen la compatibilidad si eñ frontend buscaba otras claves
  participacionGeneral?: Grafico; // opcional, por compatibilidad
  preguntasRadio?: Grafico[];     // opcional, por compatibilidad
  tendenciasTemporales?: Grafico; // opcional, por compatibilidad
}
export interface Grafico {
  tipo: string;
  titulo: string;
  datos: DatoGrafico[];
  preguntaId?: string;
  totalRespuestas?: number;
}

export interface DatoGrafico {
  label: string;
  value: number;
  color?: string;
  porcentaje?: number; // a veces viene calculado por backend
}


// Para estadísticas básicas
export interface EstadisticasResponse {
  success: boolean;
  estadisticas: Estadisticas;
}

export interface Estadisticas {
  encuestaId: string;
  titulo: string;
  totalRespuestas: number;
  fechaCreacion: string;
  estado: string;
  completitud: number;
  ultimaRespuesta: string | null;
  tendencias: Tendencias;
}

