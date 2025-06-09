import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Encuesta, Pregunta } from '../interfaces/encuestaInterface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestasApiService {


  private apiLinkEncuestas = environment.INQUIRO_API_LINK + "/encuestas";
  
  private http = inject(HttpClient)

  constructor() { }

  crearEncuesta(encuesta : Encuesta){
    this.http.post<EncuestaResponse>(this.apiLinkEncuestas, encuesta
    ).subscribe((resp) => {
        console.log('Respuesta: ', resp);

        let idEncuesta = resp.InquiroSK;

        if( idEncuesta ){
          alert(`Encuesta creada! idEncuesta: ${idEncuesta}\nLink encuesta: encuestas.inquiro.site/${idEncuesta}`);
          console.log(`Encuesta creada! idEncuesta: ${idEncuesta}\nLink encuesta: encuestas.inquiro.site/${idEncuesta}`);
        }
    });
  }
}

interface EncuestaResponse{
  InquiroPK: string, 
  InquiroSK: string, 
  titulo: string, 
  preguntas: Pregunta[], 
  fechaCreacion: string
}