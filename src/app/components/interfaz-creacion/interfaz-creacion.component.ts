import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interfaz-creacion',
  imports: [FormsModule, CommonModule],
  templateUrl: './interfaz-creacion.component.html',
  styleUrl: './interfaz-creacion.component.css'
})
export class InterfazCreacionComponent {
  opciones_preguntas : opcionesPregunta[] = [{valor:"opciones_radio",texto:"Opciones"}, {valor:"abierta",texto:"Pregunta abierta"}];
  pregunta_a_crear: string = "opciones_radio";

  idEmail: string = "";
  preguntas: Pregunta[] = [];

  agregarPregunta(): void{
    let preguntaCreada: Pregunta;
    let texto = prompt("Ingrese texto de pregunta");
    if(!texto || texto.length == 0)
      return
    switch(this.pregunta_a_crear){
      case "opciones_radio":
        let opcionesTxt = prompt("Ingrese opciones separadas por ;");
        if(!opcionesTxt || opcionesTxt.length == 0)
            return
        let opciones = opcionesTxt.split(";");
        
        preguntaCreada = new Pregunta(this.pregunta_a_crear, texto || "", opciones);
        this.preguntas.push(preguntaCreada);
        break;
      case "abierta":
        preguntaCreada = new Pregunta(this.pregunta_a_crear, texto || "")
        this.preguntas.push(preguntaCreada);
        break;
    }
  }
    

}

class Pregunta{
  tipo: string;
  opciones: string[];
  texto: string;
  constructor(tipo: string, texto: string, opciones?:string[]) {
    this.tipo = tipo;
    this.texto = texto;
    this.opciones = opciones || [];
  }
}

interface opcionesPregunta{
  valor : string,
  texto : string
}

