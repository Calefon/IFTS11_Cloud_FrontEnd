import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EncuestaResponse } from '../../interfaces/encuestaInterface';
import { EncuestasApiService } from '../../services/encuestas-api.service';

@Component({
  selector: 'app-editar-page-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-page-component.component.html'
})
export class EditarPageComponentComponent implements OnInit {

  private encuestaService = inject(EncuestasApiService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  encuestaForm!: FormGroup;
  encuesta: EncuestaResponse | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  async ngOnInit() {
    await this.cargarEncuesta();
  }

  async cargarEncuesta() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const pk = this.route.snapshot.paramMap.get('pk');
    const sk = this.route.snapshot.paramMap.get('sk');

    if (!pk || !sk) {
      this.errorMessage = 'Faltan parámetros en la URL.';
      this.isLoading = false;
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

      this.encuesta = encontrada;
      this.inicializarFormulario();

    } catch (error) {
      console.error('Error al cargar encuesta:', error);
      this.errorMessage = 'No se pudo cargar la encuesta.';
    } finally {
      this.isLoading = false;
    }
  }

  private inicializarFormulario() {
    if (!this.encuesta) return;

    this.encuestaForm = this.fb.group({
      titulo: [this.encuesta.titulo, [Validators.required, Validators.minLength(3)]],
      estado: [this.encuesta.estado || 'activa', Validators.required],
      preguntas: this.fb.array(
        this.encuesta.preguntas.map((p: any) =>
          this.fb.group({
            tipoPregunta: [p.tipoPregunta, Validators.required],
            pregunta: [p.pregunta, [Validators.required, Validators.minLength(5)]],
            opciones: this.fb.array(
              (p.tipoPregunta !== 'abierta' && p.opciones) 
                ? p.opciones.map((op: string) => this.fb.control(op, Validators.required))
                : []
            )
          })
        )
      )
    });
  }

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  opciones(pIndex: number): FormArray {
    return this.preguntas.at(pIndex).get('opciones') as FormArray;
  }

  onTipoPreguntaChange(pIndex: number) {
    const tipoPregunta = this.preguntas.at(pIndex).get('tipoPregunta')?.value;
    const opcionesArray = this.opciones(pIndex);
    
    if (tipoPregunta === 'abierta') {
      while (opcionesArray.length > 0) {
        opcionesArray.removeAt(0);
      }
    } else if (opcionesArray.length === 0) {
      this.agregarOpcion(pIndex);
    }
  }

  agregarPregunta() {
    this.preguntas.push(
      this.fb.group({
        tipoPregunta: ['abierta', Validators.required],
        pregunta: ['', [Validators.required, Validators.minLength(5)]],
        opciones: this.fb.array([])
      })
    );
  }

  eliminarPregunta(index: number) {
    if (this.preguntas.length > 1) {
      this.preguntas.removeAt(index);
    }
  }

  agregarOpcion(pIndex: number) {
    this.opciones(pIndex).push(this.fb.control('', Validators.required));
  }

  eliminarOpcion(pIndex: number, oIndex: number) {
    if (this.opciones(pIndex).length > 1) {
      this.opciones(pIndex).removeAt(oIndex);
    }
  }

  async guardarCambios() {
    if (this.encuestaForm.invalid || !this.encuesta) {
      this.marcarCamposComoSucios();
      this.errorMessage = 'Por favor, completá todos los campos obligatorios correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formValue = this.encuestaForm.value;
      
      // Filtrar preguntas válidas
      const preguntasValidadas = formValue.preguntas.map((p: any) => ({
        tipoPregunta: p.tipoPregunta,
        pregunta: p.pregunta,
        opciones: p.tipoPregunta !== 'abierta' ? p.opciones.filter((op: string) => op.trim() !== '') : []
      }));

      const updatedEncuesta: EncuestaResponse = {
        ...this.encuesta,
        titulo: formValue.titulo,
        estado: formValue.estado,
        preguntas: preguntasValidadas
      };

      await this.encuestaService.actualizarEncuesta(updatedEncuesta);
      this.successMessage = '✅ Encuesta actualizada correctamente.';

    } catch (error) {
      console.error('Error al actualizar encuesta:', error);
      this.errorMessage = '❌ No se pudo guardar la encuesta. Intentalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  private marcarCamposComoSucios() {
    Object.keys(this.encuestaForm.controls).forEach(key => {
      const control = this.encuestaForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subKey => {
          control.get(subKey)?.markAsTouched();
        });
      } else {
        control?.markAsTouched();
      }
    });
  }
}