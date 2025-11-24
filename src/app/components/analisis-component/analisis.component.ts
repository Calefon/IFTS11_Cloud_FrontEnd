import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalisisService } from '../../services/analisis.service';
import { AnalisisResponse } from '../../interfaces/analisis.model';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit {
  encuestaId: string = '';
  analisis: any;
  cargando: boolean = false;
  tipoAnalisis: 'rapido' | 'ia' = 'rapido';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private analisisService: AnalisisService
  ) {}

  ngOnInit() {
    this.encuestaId = this.route.snapshot.params['id'];
  }

  async generarAnalisis() {
    this.cargando = true;
    this.error = '';
    
    try {
      const response: AnalisisResponse = await this.analisisService.generarAnalisis(this.encuestaId, this.tipoAnalisis);
      
      if (response.success) {
        this.analisis = response.analisis;
      } else {
        this.error = response.mensaje || 'Error desconocido';
      }
      
    } catch (error: any) {
      console.error('Error:', error);
      this.error = error.message || 'Error al generar análisis';
    } finally {
      this.cargando = false;
    }
  }
}