import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  /* IMÁGENES GENÉRICAS */
  private readonly eventImages: string[] = [
    'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2',
    'https://images.unsplash.com/photo-1518972559570-0cbea7f9d7f4',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'
  ];

  /* PRÓXIMOS EVENTOS */
  proximosEventos = this.withImages([
    { idEvent: 1, nameEvent: 'Película A', dateTimeEvent: new Date(), venue: 'Cine X', eventType: 'Cine' },
    { idEvent: 2, nameEvent: 'Concierto B', dateTimeEvent: new Date(), venue: 'Auditorio Y', eventType: 'Música' }
  ]);

  /* RECOMENDACIONES */
  recomendaciones = this.withImages([
    { idEvent: 3, nameEvent: 'Teatro C', dateTimeEvent: new Date(), venue: 'Teatro Z', eventType: 'Teatro' },
    { idEvent: 4, nameEvent: 'Película D', dateTimeEvent: new Date(), venue: 'Cine W', eventType: 'Cine' }
  ]);

  /* OFERTAS */
  ofertas = this.withImages([
    { id: 1, name: 'Combo Popcorn + Soda', description: '50% de descuento en combos' },
    { id: 2, name: 'Entrada 2x1', description: 'Compra una entrada y lleva otra gratis' }
  ]);

  /* ===============================
     HELPERS
     =============================== */

  private withImages<T>(items: T[]): (T & { imageUrl: string })[] {
    return items.map(item => ({
      ...item,
      imageUrl: this.randomImage()
    }));
  }

  private randomImage(): string {
    return this.eventImages[
      Math.floor(Math.random() * this.eventImages.length)
    ];
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';
  }
}
