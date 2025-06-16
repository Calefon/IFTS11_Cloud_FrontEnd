import { CommonModule } from '@angular/common';
import { Component, inject, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { Encuesta, Pregunta } from '../../interfaces/encuestaInterface';

@Component({
  selector: 'app-interfaz-creacion',
  imports: [FormsModule, CommonModule],
  templateUrl: './interfaz-creacion.component.html',
  styleUrl: './interfaz-creacion.component.css',
})
export class InterfazCreacionComponent {
  opciones_preguntas: opcionesPregunta[] = [
    { valor: 'default', texto: '-- Elija un tipo --' },
    { valor: 'abierta', texto: 'Pregunta abierta' },
    { valor: 'opciones_radio', texto: 'Radio' },
    { valor: 'opciones_checkbox', texto: 'Checkbox' },
  ];
  // pregunta_a_crear: string = 'default';

  pregunta_a_crear = signal<string>('default');
  encuestasService = inject(EncuestasApiService);

  idEmail: string = '';
  preguntas: PreguntaEnc[] = [];

  preguntaKevin = signal('');
  opcionesRadio = signal<string[]>([]);

  agregarPregunta(): void {
    let preguntaCreada: PreguntaEnc;
    let texto = prompt('Ingrese texto de pregunta');
    if (!texto || texto.length == 0) return;
    switch (this.pregunta_a_crear()) {
      case 'abierta':
        preguntaCreada = new PreguntaEnc(
          this.pregunta_a_crear(),
          this.preguntaKevin() || ''
        );
        this.preguntas.push(preguntaCreada);
        break;
      case 'opciones_radio':
        let opcionesTxt = prompt('Ingrese opciones separadas por ;');
        if (!opcionesTxt || opcionesTxt.length == 0) return;
        let opciones = opcionesTxt.split(';');

        preguntaCreada = new PreguntaEnc(
          this.pregunta_a_crear(),
          texto || '',
          opciones
        );
        this.preguntas.push(preguntaCreada);
        break;
      case 'opciones_checkbox':
      //     let opcionesTxt = prompt("Ingrese opciones separadas por ;");
      //     if(!opcionesTxt || opcionesTxt.length == 0)
      //         return
      //     let opciones = opcionesTxt.split(";");

      //     preguntaCreada = new PreguntaEnc(this.pregunta_a_crear, texto || "", opciones);
      //     this.preguntas.push(preguntaCreada);
      //     break;
    }
  }

  agregarPreguntaKevin(): void {
    let preguntaCreada: PreguntaEnc;

    switch (this.pregunta_a_crear()) {
      case 'abierta':
        preguntaCreada = new PreguntaEnc(
          this.pregunta_a_crear(),
          this.preguntaKevin() || ''
        );
        this.preguntas.push(preguntaCreada);
        this.resetField();
        break;
      case 'opciones_radio':
      // let opcionesTxt = prompt('Ingrese opciones separadas por ;');
      // if (!opcionesTxt || opcionesTxt.length == 0) return;
      // let opciones = opcionesTxt.split(';');

      // preguntaCreada = new PreguntaEnc(
      //   this.pregunta_a_crear,
      //   texto || '',
      //   opciones
      // );
      // this.preguntas.push(preguntaCreada);
      // break;
      case 'opciones_checkbox':
    }
  }

  eliminarPregunta(index: number) {
    this.preguntas.splice(index, 1);
  }

  crearEncuesta() {
    let encuesta = <Encuesta>{};
    encuesta.email = this.idEmail;
    encuesta.titulo = 'Encuesta';
    encuesta.preguntas = this.preguntas;
    this.encuestasService.crearEncuesta(encuesta);
  }

  addOption(preguntaACrear: string) {
    this.pregunta_a_crear.set(preguntaACrear);
    const container = document.querySelector('#container');
    switch (preguntaACrear) {
      case 'abierta':
        if (container) {
          container.innerHTML = `
          <label class="font-medium">Respuesta</label>
          <input type="text" placeholder="Respuesta del usuario" readonly class="outline-1 outline-black px-3 py-2 w-3/4 placeholder:text-gray-400 placeholder:italic cursor-no-drop"/>
          `;
        }
        this.pregunta_a_crear.set('default');
        break;
      case 'opciones_radio':
        // let opcionesTxt = prompt('Ingrese opciones separadas por ;');
        // if (!opcionesTxt || opcionesTxt.length == 0) return;
        // let opciones = opcionesTxt.split(';');

        // preguntaCreada = new PreguntaEnc(
        //   this.pregunta_a_crear,
        //   texto || '',
        //   opciones
        // );
        // this.preguntas.push(preguntaCreada);
        if (container) {
          container.innerHTML = `
          <label class="font-medium">Opciones</label>
          <input
            type="text"
            placeholder="Opción del usuario"
            class="outline-1 outline-black px-3 py-2 w-3/4 placeholder:text-gray-400 placeholder:italic"
            (keyup.enter)="addOptionRadio(txtOpcionRadio.value)"
            #txtOpcionRadio
          />
          `;
        }
        break;
      case 'opciones_checkbox':
        break;
    }
  }

  addOptionRadio(opcion: string) {
    this.opcionesRadio.update((prev) => [...prev, opcion]);
    console.log(this.opcionesRadio())
  }

  resetField() {
    this.preguntaKevin.set('');
  }
}

class PreguntaEnc implements Pregunta {
  tipoPregunta: string;
  opciones: string[];
  pregunta: string;
  constructor(tipo: string, texto: string, opciones?: string[]) {
    this.tipoPregunta = tipo;
    this.pregunta = texto;
    this.opciones = opciones || [];
  }
}

interface opcionesPregunta {
  valor: string;
  texto: string;
}
