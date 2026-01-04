import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],  // 🔹 necesario para ngFor y date pipe
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  // ⚡ corregido de styleUrl → styleUrls
})
export class DashboardComponent {

  // Datos de ejemplo: próximos eventos que el cliente compró
  proximosEventos = [
    { idEvent: 1, nameEvent: 'Película A', dateTimeEvent: new Date(), venue: 'Cine X', imageUrl: 'https://via.placeholder.com/200x130', eventType: 'Cine' },
    { idEvent: 2, nameEvent: 'Concierto B', dateTimeEvent: new Date(), venue: 'Auditorio Y', imageUrl: 'https://via.placeholder.com/200x130', eventType: 'Música' }
  ];

  // Recomendaciones según historial
  recomendaciones = [
    { idEvent: 3, nameEvent: 'Teatro C', dateTimeEvent: new Date(), venue: 'Teatro Z', imageUrl: 'https://via.placeholder.com/200x130', eventType: 'Teatro' },
    { idEvent: 4, nameEvent: 'Película D', dateTimeEvent: new Date(), venue: 'Cine W', imageUrl: 'https://via.placeholder.com/200x130', eventType: 'Cine' }
  ];

  // Ofertas de combos/productos destacados
  ofertas = [
    { id: 1, name: 'Combo Popcorn + Soda', description: '50% de descuento en combos', imageUrl: 'https://via.placeholder.com/200x130' },
    { id: 2, name: 'Entrada 2x1', description: 'Compra una entrada y lleva otra gratis', imageUrl: 'https://via.placeholder.com/200x130' }
  ];

}
