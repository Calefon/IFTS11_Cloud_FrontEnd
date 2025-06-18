export interface Encuesta {
    email:string,
    titulo:string,
    preguntas: Pregunta[]
}

export interface Pregunta {
  tipoPregunta: string,
  pregunta: string,
  opciones?: string[]
}

export interface EncuestaHistorial {
  encuestas: Encuesta[];
}

export interface EncuestaResponse {
  InquiroPK: string;
  InquiroSK: string;
  titulo: string;
  preguntas: Pregunta[];
  fechaCreacion: string;
}
