import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cantidad$;

  constructor(private router: Router, private cartService: CartService) {
    this.cantidad$ = this.cartService.cartCount$;
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

   irCarrito() {
    this.router.navigate(['/checkout']);
  }
}
