import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // ==================== ALERTAS DE ÉXITO ====================
  success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#10b981',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup',
        confirmButton: 'sweet-button'
      }
    });
  }

  // ==================== ALERTAS DE ERROR ====================
  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup',
        confirmButton: 'sweet-button'
      }
    });
  }

  // ==================== ALERTAS DE ADVERTENCIA ====================
  warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#f59e0b',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup',
        confirmButton: 'sweet-button'
      }
    });
  }

  // ==================== ALERTAS DE INFORMACIÓN ====================
  info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3b82f6',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup',
        confirmButton: 'sweet-button'
      }
    });
  }

  // ==================== CONFIRMACIÓN ====================
  confirm(title: string, text: string) {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup',
        confirmButton: 'sweet-button',
        cancelButton: 'sweet-button-cancel'
      }
    });
  }

  // ==================== LOADING ====================
  loading(title: string = 'Cargando...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup'
      }
    });
  }

  // ==================== CERRAR LOADING ====================
  close() {
    Swal.close();
  }

  // ==================== TOAST (Notificación pequeña) ====================
  toast(icon: 'success' | 'error' | 'warning' | 'info', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#1e293b',
      color: '#fff',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    return Toast.fire({
      icon: icon,
      title: title
    });
  }

  // ==================== CARRITO AGREGADO ====================
  carritoAgregado(producto: string, cantidad: number, total: number) {
    return Swal.fire({
      icon: 'success',
      title: '¡Agregado al Carrito!',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0.5rem 0;"><strong>Producto:</strong> ${producto}</p>
          <p style="margin: 0.5rem 0;"><strong>Cantidad:</strong> ${cantidad}</p>
          <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #10b981;">
            <strong>Total:</strong> $${total}
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '🛒 Ver Carrito',
      cancelButtonText: 'Seguir Comprando',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'sweet-popup',
        confirmButton: 'sweet-button',
        cancelButton: 'sweet-button-cancel'
      }
    });
  }
}