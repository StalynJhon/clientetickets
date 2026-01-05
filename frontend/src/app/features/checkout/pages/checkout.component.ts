import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  // Variable para controlar la vista del Ticket
  purchaseSuccess: boolean = false;
  orderNumber: string = '';
  purchaseDate: Date = new Date();

  customerData = {
    name: '',
    email: '',
    paymentMethod: 'tarjeta'
  };

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      // Solo actualizamos si NO hemos finalizado la compra para mantener los datos en el ticket
      if (!this.purchaseSuccess) {
        this.cartItems = items;
        this.total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
      }
    });
  }

  // --- Funciones de editar carrito (iguales) ---
  aumentar(item: CartItem) { this.cartService.updateQuantity(item.id, 1); }
  disminuir(item: CartItem) { this.cartService.updateQuantity(item.id, -1); }
  eliminar(item: CartItem) {
    if(confirm('¿Eliminar?')) this.cartService.removeItem(item.id);
  }

  procesarCompra() {
    if (this.cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!this.customerData.name || !this.customerData.email) {
      alert("Por favor completa tu nombre y correo");
      return;
    }

    // 1. Generamos datos de simulación
    this.orderNumber = 'ORD-' + Math.floor(Math.random() * 10000);
    this.purchaseDate = new Date();

    // 2. Activamos la vista del ticket
    this.purchaseSuccess = true;

    // NOTA: No borramos el carrito aquí todavía para poder mostrar los items en el ticket
  }

  finalizarYSalir() {
    // 3. Ahora sí limpiamos y nos vamos
    this.cartService.clearCart();
    this.router.navigate(['/product-list']); // O la ruta principal que tengas
  }
}