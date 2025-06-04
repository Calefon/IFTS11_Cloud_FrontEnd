import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Encuesta } from '../interfaces/encuestaInterface';

@Injectable({
  providedIn: 'root'
})
export class EncuestasApiService {

  //
  // GABI
  private apiLinkEncuestas = 'http://inquiro-env-1.eba-fzt6xm2r.us-east-1.elasticbeanstalk.com/encuestas'
  //private apiLinkEncuestas = 'http://inquiro-back-eze.us-east-1.elasticbeanstalk.com/encuestas'
  private http = inject(HttpClient)

  constructor() { }

  crearEncuesta(encuesta : Encuesta){
    this.http.post(this.apiLinkEncuestas, encuesta
    ).subscribe(resp => {
        console.log('Respuesta: ', resp);
    });
  }
}
