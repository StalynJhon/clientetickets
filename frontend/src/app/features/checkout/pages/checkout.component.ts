import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el formulario
import { CartService, CartItem } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  // Datos del Cliente (Registro rápido)
  customerData = {
    name: '',
    email: '',
    paymentMethod: 'tarjeta'
  };

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  procesarCompra() {
    if (this.cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Aquí iría la conexión con tu Backend para crear la orden
    console.log("Procesando pago...", this.customerData, this.cartItems);

    alert("¡Compra exitosa! Tu ticket ha sido generado.");
    this.cartService.clearCart();
    this.router.navigate(['/dashboard']);
  }
}