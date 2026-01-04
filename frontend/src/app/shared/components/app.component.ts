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
  isAccordionOpen = false;

  toggleAccordion(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  closeAccordion(): void {
    this.isAccordionOpen = false;
  }

  onSubItemClick(): void {
    // Close the accordion after a short delay to allow navigation to occur
    setTimeout(() => {
      this.isAccordionOpen = false;
    }, 150);
  }
}
