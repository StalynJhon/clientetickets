import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-ayuda-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ayuda-faq.component.html',
  styleUrls: ['./ayuda-faq.component.css']
})
export class AyudaFaqComponent implements OnInit {

  ayuda: any = null;
  cargando = true;
  error = false;

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarAyuda();
  }

  cargarAyuda() {
    this.configuracionService.getAyudaFAQ().subscribe({
      next: (data) => {
        this.ayuda = data;
        // Inicializar el estado expandido para cada FAQ
        if (this.ayuda.faqs && Array.isArray(this.ayuda.faqs)) {
          this.ayuda.faqs = this.ayuda.faqs.map((faq: any) => ({
            ...faq,
            expandido: false
          }));
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar ayuda/FAQ:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  toggleFaq(index: number) {
    if (this.ayuda && this.ayuda.faqs && this.ayuda.faqs[index]) {
      this.ayuda.faqs[index].expandido = !this.ayuda.faqs[index].expandido;
    }
  }
}