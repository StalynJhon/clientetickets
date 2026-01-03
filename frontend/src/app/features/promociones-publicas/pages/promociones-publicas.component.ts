import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PromocionesPublicasService } from '../promociones-publicas.service';

@Component({
  selector: 'app-promociones-publicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promociones-publicas.component.html',
  styleUrls: ['./promociones-publicas.component.css']
})
export class PromocionesPublicasComponent implements OnInit {

  promociones: any[] = [];
  promocionesActivas: any[] = [];

  promoSeleccionada: any = null;
  codigoIngresado = '';

  constructor(private promoService: PromocionesPublicasService) {}

  ngOnInit(): void {
    this.cargarPromociones();
  }

  cargarPromociones() {
    this.promoService.obtenerPromociones().subscribe(res => {
      const hoy = new Date();
      this.promociones = res;

      this.promocionesActivas = this.promociones.filter(p =>
        new Date(p.startDate) <= hoy && new Date(p.endDate) >= hoy
      );
    });
  }

  seleccionarPromocion(promo: any) {
    // PROMO AUTOMÁTICA
    if (!promo.promoCode) {
      Swal.fire(
        'Promoción aplicada 🎉',
        `Se aplicó ${promo.discountValue}% de descuento`,
        'success'
      );

      // 🔹 MARCAR COMO USADA
      promo.used = true;
      return;
    }

    // PROMO CON CÓDIGO
    this.promoSeleccionada = promo;
    this.codigoIngresado = '';
  }

  aplicarCodigo() {
    if (!this.promoSeleccionada) return;

    if (
      this.codigoIngresado.toLowerCase() !==
      this.promoSeleccionada.promoCode.toLowerCase()
    ) {
      Swal.fire('Código incorrecto', 'Intenta nuevamente', 'error');
      return;
    }

    Swal.fire(
      'Código válido 🎉',
      `Descuento de ${this.promoSeleccionada.discountValue}% aplicado`,
      'success'
    );

    // 🔹 MARCAR COMO USADA
    this.promoSeleccionada.used = true;

    this.promoSeleccionada = null;
    this.codigoIngresado = '';
  }

  // 🔥 NUEVO: calcular precio final
  calcularPrecioFinal(precio: number, descuento: number): number {
    if (!precio || !descuento) {
      return precio;
    }
    return precio - (precio * descuento) / 100;
  }
}
