import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

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
  private _items = new BehaviorSubject<CartItem[]>([]);
  public items$ = this._items.asObservable();

  // Observable para el contador del Navbar
  public cartCount$ = this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + item.cantidad, 0))
  );

  // Observable para el Total en Dinero ($)
  public cartTotal$ = this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0))
  );

  constructor() {}

  addToCart(newItem: CartItem) {
    const currentItems = this._items.getValue();
    const existingIndex = currentItems.findIndex(i => i.id === newItem.id && i.tipo === newItem.tipo);

    if (existingIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingIndex].cantidad += newItem.cantidad;
      this._items.next(updatedItems);
    } else {
      this._items.next([...currentItems, newItem]);
    }
  }

  // NUEVO: Función para actualizar cantidad (+ o -)
  updateQuantity(id: string, change: number) {
    const currentItems = this._items.getValue();
    const index = currentItems.findIndex(i => i.id === id);

    if (index > -1) {
      const updatedItems = [...currentItems];
      const newQuantity = updatedItems[index].cantidad + change;

      if (newQuantity > 0) {
        updatedItems[index].cantidad = newQuantity;
        this._items.next(updatedItems);
      } else {
        // Si baja a 0, preguntamos si quiere borrar o lo borramos directo
        this.removeItem(id);
      }
    }
  }

  removeItem(id: string) {
    const currentItems = this._items.getValue().filter(item => item.id !== id);
    this._items.next(currentItems);
  }

  clearCart() {
    this._items.next([]);
  }
}