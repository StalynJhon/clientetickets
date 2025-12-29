import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {

  terminos: any = null;
  cargando = true;
  error = false;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarTerminos();
  }

  cargarTerminos() {
    this.configuracionService.getTerminosCondiciones().subscribe({
      next: (data) => {
        this.terminos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar términos y condiciones:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


}