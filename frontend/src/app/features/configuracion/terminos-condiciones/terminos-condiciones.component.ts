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
  textosLegales: any = null;
  cargando = true;
  error = false;
  usuarioAcepto = false;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarTextosLegales();
  }

  cargarTextosLegales() {
    this.configuracionService.getTextosLegales().subscribe({
      next: (data) => {
        this.textosLegales = data;
        this.terminos = data; // Mantener compatibilidad con el HTML existente
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar textos legales:', err);
        // Si falla la nueva API, intentar con la antigua
        this.cargarTerminosAntiguo();
      }
    });
  }
  
  cargarTerminosAntiguo() {
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

  aceptarTerminos(): void {
    this.usuarioAcepto = true;
    // In a real application, you would save this to a service or backend
    console.log('Usuario ha aceptado los términos y condiciones');
  }

  imprimirTerminos(): void {
    window.print();
  }

}