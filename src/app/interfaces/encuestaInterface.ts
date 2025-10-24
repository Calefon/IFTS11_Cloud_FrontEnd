export interface Encuesta {
    email: string;
    titulo: string;
    descripcion: string;
    preguntas: Pregunta[];
}

export interface Pregunta {
    tipoPregunta: string; // 'abierta', 'opciones_radio', 'opciones_checkbox'
    pregunta: string;
    opciones?: string[];
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
    descripcion?: string; 
    estado?: string; 
}

export interface RespuestaAPI {
    respuestasInquiroPK: string;
    respuestasInquiroSK: string;
    fechaRespuesta: string;
    respuestas: Array<{
        pregunta: string;
        respuesta: string | string[];
    }>;
}

export interface RespuestaEncuesta {
    respuestaId: string;
    encuestaId: string;
    fecha: string;
    respuestas: {
        [pregunta: string]: string | string[];
    };
}