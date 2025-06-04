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