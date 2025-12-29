import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-politica-privacidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.css']
})
export class PoliticaPrivacidadComponent implements OnInit {

  politica: any = null;
  cargando = true;
  error = false;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarPolitica();
  }

  cargarPolitica() {
    this.configuracionService.getPoliticaPrivacidad().subscribe({
      next: (data) => {
        this.politica = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar política de privacidad:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }


}