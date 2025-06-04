import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { Encuesta, Pregunta} from '../../interfaces/encuestaInterface';

@Component({
  selector: 'app-interfaz-creacion',
  imports: [FormsModule, CommonModule],
  templateUrl: './interfaz-creacion.component.html',
  styleUrl: './interfaz-creacion.component.css'
})
export class InterfazCreacionComponent {
  opciones_preguntas : opcionesPregunta[] = [{valor:"opciones_radio",texto:"Opciones"}, {valor:"abierta",texto:"Pregunta abierta"}];
  pregunta_a_crear: string = "opciones_radio";
  encuestasService = inject(EncuestasApiService);

  idEmail: string = "";
  preguntas: PreguntaEnc[] = [];

  agregarPregunta(): void{
    let preguntaCreada: PreguntaEnc;
    let texto = prompt("Ingrese texto de pregunta");
    if(!texto || texto.length == 0)
      return
    switch(this.pregunta_a_crear){
      case "opciones_radio":
        let opcionesTxt = prompt("Ingrese opciones separadas por ;");
        if(!opcionesTxt || opcionesTxt.length == 0)
            return
        let opciones = opcionesTxt.split(";");
        
        preguntaCreada = new PreguntaEnc(this.pregunta_a_crear, texto || "", opciones);
        this.preguntas.push(preguntaCreada);
        break;
      case "abierta":
        preguntaCreada = new PreguntaEnc(this.pregunta_a_crear, texto || "")
        this.preguntas.push(preguntaCreada);
        break;
    }
  }

  eliminarPregunta(index:number){
    this.preguntas.splice(index,1);
  }

  crearEncuesta(){
    let encuesta = <Encuesta>{};
    encuesta.email =  this.idEmail;
    encuesta.titulo = "Encuesta";
    encuesta.preguntas = this.preguntas;
    this.encuestasService.crearEncuesta(encuesta);
  }
    

}

class PreguntaEnc implements Pregunta{
  tipoPregunta: string;
  opciones: string[];
  pregunta: string;
  constructor(tipo: string, texto: string, opciones?:string[]) {
    this.tipoPregunta = tipo;
    this.pregunta = texto;
    this.opciones = opciones || [];
  }
}

interface opcionesPregunta{
  valor : string,
  texto : string
}

