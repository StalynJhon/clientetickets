import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definimos la estructura del ítem del carrito
export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: 'producto' | 'ticket' | 'transporte';
  imagen?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // BehaviorSubject guarda el estado actual del carrito
  private _items = new BehaviorSubject<CartItem[]>([]);
  public items$ = this._items.asObservable();

  constructor() {}

  // Función para agregar ítems
  addToCart(newItem: CartItem) {
    const currentItems = this._items.getValue();

    // Verificamos si ya existe el ítem (por ID y Tipo) para no duplicarlo, solo sumar cantidad
    const existingIndex = currentItems.findIndex(i => i.id === newItem.id && i.tipo === newItem.tipo);

    if (existingIndex > -1) {
      // Si existe, creamos una copia y actualizamos la cantidad
      const updatedItems = [...currentItems];
      updatedItems[existingIndex].cantidad += newItem.cantidad;
      this._items.next(updatedItems);
    } else {
      // Si no existe, lo agregamos al array
      this._items.next([...currentItems, newItem]);
    }

    // CONSOLA: Esto te confirmará que el dato llegó bien
    console.log('✅ Carrito actualizado:', this._items.getValue());
  }

  // Quitar un ítem
  removeItem(id: string) {
    const currentItems = this._items.getValue().filter(item => item.id !== id);
    this._items.next(currentItems);
  }

  // Limpiar todo (al comprar)
  clearCart() {
    this._items.next([]);
  }

  // Calcular Total ($)
  getTotal(): number {
    return this._items.getValue().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  // Contar cuántos ítems hay
  getItemsCount(): number {
    return this._items.getValue().reduce((acc, item) => acc + item.cantidad, 0);
  }
}