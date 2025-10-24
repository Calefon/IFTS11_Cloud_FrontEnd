import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EncuestasApiService } from '../../services/encuestas-api.service';
import { EncuestaResponse } from '../../interfaces/encuestaInterface';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-encuesta-page',
  standalone: true,
  imports: [CommonModule, ClipboardModule],
  templateUrl: './encuesta-page.component.html',
  styleUrls: ['./encuesta-page.component.css'],
})
export class EncuestaPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private encuestaService = inject(EncuestasApiService);
  copyClicked = signal(false);
  link_encuesta_signal = signal("");

  encuesta: EncuestaResponse | null = null;
  cargando = true;
  errorMessage = '';

  async ngOnInit() {
    await this.cargarEncuesta();
  }

  async cargarEncuesta() {
  this.cargando = true;
  this.errorMessage = '';

  const pk = this.route.snapshot.paramMap.get('pk');
  const sk = this.route.snapshot.paramMap.get('sk');

  if (!pk || !sk) {
    this.errorMessage = 'Faltan parámetros en la URL.';
    this.cargando = false;
    return;
  }

  try {
   
    const encuestas = await this.encuestaService.verEncuestas();
    const encontrada = encuestas.find(
      (e: EncuestaResponse) => e.InquiroPK === pk && e.InquiroSK === sk
    );

    if (!encontrada) {
      this.errorMessage = 'No se encontró la encuesta solicitada.';
      return;
    }
    this.link_encuesta_signal.set(environment.INQUIRO_ENCUESTAS_LINK+sk);
    this.encuesta = encontrada;
  } catch (error) {
    console.error('Error al cargar encuesta:', error);
    this.errorMessage = 'No se pudo cargar la encuesta.';
  } finally {
    this.cargando = false;
  }
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

}