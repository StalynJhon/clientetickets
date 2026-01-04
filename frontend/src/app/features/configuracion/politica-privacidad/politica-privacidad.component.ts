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
  readingProgress = 0;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarPolitica();
  }

  cargarPolitica() {
    this.configuracionService.getPoliticaPrivacidad().subscribe({
      next: (data) => {
        this.politica = data;
        this.cargando = false;
        // Set up scroll event listener after content is loaded
        setTimeout(() => {
          this.setupScrollListener();
        }, 100);
      },
      error: (err) => {
        console.error('Error al cargar política de privacidad:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  descargarPolitica(): void {
    // In a real application, this would download the actual document
    alert('Descargando política de privacidad...');
  }

  compartirPolitica(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Política de Privacidad',
        text: 'Consulta nuestra política de privacidad',
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  }

  setupScrollListener(): void {
    const contentElement = document.querySelector('.privacidad-body');
    if (contentElement) {
      window.addEventListener('scroll', () => {
        this.updateReadingProgress();
      });
      // Initial update
      this.updateReadingProgress();
    }
  }

  updateReadingProgress(): void {
    const contentElement = document.querySelector('.privacidad-body');
    if (contentElement) {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.min(scrollPercent * 100, 100);
      
      this.readingProgress = Math.round(scrollPercentRounded);
    }
  }

}