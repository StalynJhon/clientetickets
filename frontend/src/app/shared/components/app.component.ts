import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-ticket';

  // ===== Funcionalidad eventos =====
  eventosAbierto = false;

  toggleEventos(): void {
    this.eventosAbierto = !this.eventosAbierto;
  }

  // ===== Funcionalidad accordion =====
  isAccordionOpen = false;

  toggleAccordion(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  closeAccordion(): void {
    this.isAccordionOpen = false;
  }

  onSubItemClick(): void {
    // Cierra el accordion después de navegar
    setTimeout(() => {
      this.isAccordionOpen = false;
    }, 150);
  }
}
