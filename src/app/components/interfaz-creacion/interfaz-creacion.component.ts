import { CommonModule } from '@angular/common';
import { Component, inject, Signal, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { Encuesta, Pregunta } from '../../interfaces/encuestaInterface';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-interfaz-creacion',
  imports: [FormsModule, CommonModule, ClipboardModule],
  templateUrl: './interfaz-creacion.component.html',
  styleUrl: './interfaz-creacion.component.css',
})
export class InterfazCreacionComponent {
  @ViewChild('modal') modalRef!: ElementRef;
  @ViewChild('openModalButton') openModalRef!: ElementRef;
  

  opciones_preguntas: opcionesPregunta[] = [
    { valor: 'default', texto: '-- Elija un tipo --' },
    { valor: 'abierta', texto: 'Pregunta abierta' },
    { valor: 'opciones_radio', texto: 'Radio' },
  ];

  link_encuesta_signal = signal('');
  copyClicked = signal(false);

  pregunta_a_crear = signal<string>('default');
  encuestasService = inject(EncuestasApiService);

  tituloEncuesta = signal<string>('');
  descEncuesta = signal<string>('');
  emailEncuesta = signal<string>('');

  idEmail: string = '';
  preguntas: PreguntaEnc[] = [];

  preguntaKevin = signal('');
  opcionRadio = signal<string>('');
  opcionesRadio = signal<string[]>([]);

  openModal() {
    this.openModalRef.nativeElement.click()
  }

  onCopied(success : boolean){
    console.log(success)
    if (success) {
      this.copyClicked.set(true);
      setTimeout(
        ()=>{
          this.copyClicked.set(false);
        },
        1000
      );
    }
  }

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
        this.pregunta_a_crear.set('default');
        this.resetField();
        break;
      case 'opciones_radio':
        preguntaCreada = new PreguntaEnc(
          this.pregunta_a_crear(),
          this.preguntaKevin() || '',
          this.opcionesRadio() || []
        );
        if(preguntaCreada.opciones.length == 0){
          alert("Agregue opciones!");
          break;
        }
        this.preguntas.push(preguntaCreada);
        this.pregunta_a_crear.set('default');
        this.resetField();
        break;
    }
  }

  addOptionRadio() {
    if(this.opcionRadio().length == 0){
      alert("Ingrese un texto para la opción")
      return;
    }
    this.opcionesRadio.update((opciones) => [...opciones, this.opcionRadio()]);
    console.log(this.opcionesRadio());
    this.opcionRadio.set('');
  }

  resetField() {
    this.preguntaKevin.set('');
    this.opcionesRadio.set([])
  }

  eliminarPregunta(index: number) {
    this.preguntas.splice(index, 1);
  }

  updateLinkEncuesta(newLink: string){
    this.link_encuesta_signal.set(newLink);
  }

  crearEncuesta() {
    let encuesta = <Encuesta>{};
    // encuesta.email = this.idEmail;
    encuesta.email = this.emailEncuesta();
    // encuesta.titulo = 'Encuesta';
    encuesta.titulo = this.tituloEncuesta();
    encuesta.preguntas = this.preguntas;
    this.encuestasService.crearEncuesta(encuesta).subscribe((resp) => {
      console.log('Respuesta: ', resp);
    
      let idEncuesta = resp.InquiroSK;
      if (idEncuesta) {
              this.updateLinkEncuesta(
                `encuestas.inquiro.site/${idEncuesta}`
              );
              this.openModal();
              console.log(
                `Encuesta creada! idEncuesta: ${idEncuesta}\nLink encuesta: encuestas.inquiro.site/${idEncuesta}`
              );
      }
    });
    this.tituloEncuesta.set('');
    this.descEncuesta.set('');
    this.emailEncuesta.set('');
    this.preguntas = [];
  }
}

class PreguntaEnc implements Pregunta {
  tipoPregunta: string;
  pregunta: string;
  opciones: string[];
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
