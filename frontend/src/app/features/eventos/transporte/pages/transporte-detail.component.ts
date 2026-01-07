import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service';

interface Transporte {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  origen: string;
  destino: string;
  horaSalida: string;
  descripcion: string;
  asientosMax: number;
  asientosDisponibles: number;
  precio: number;
}

interface Asiento {
  id: number;
  disponible: boolean;
  seleccionado: boolean;
  fila: number;
  asiento: number;
  letra: string;
}

@Component({
  selector: 'app-transporte-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transporte-detail.component.html',
  styleUrls: ['./transporte-detail.component.css']
})
export class TransporteDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  alertService = inject(AlertService); // ← INYECTAR SERVICIO
  
  transporte: Transporte = {} as Transporte;
  asientos: Asiento[] = [];
  seleccionados: Asiento[] = [];
  loading = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || '1');
    this.cargarTransporte(id);
  }

  private cargarTransporte(id: number) {
    // Mostrar loading de SweetAlert2
    this.alertService.loading('Cargando detalles del vehículo...');
    this.loading = true;
    
    setTimeout(() => {
      const datos = this.getDatosDemo();
      this.transporte = datos[id - 1] || datos[0];
      this.generarAsientos();
      this.loading = false;
      
      // Cerrar loading
      this.alertService.close();
    }, 800);
  }

  private getDatosDemo(): Transporte[] {
    return [
      { 
        id: 1, 
        nombre: '🚌 Bus Ejecutivo Quito-Guayaquil', 
        tipo: '🚌 Bus Ejecutivo', 
        fecha: 'Jueves, 30 Enero 2026', 
        origen: 'Quito - Terminal Quitumbe', 
        destino: 'Guayaquil - Terminal Terrestre', 
        horaSalida: '22:00', 
        descripcion: 'Bus ejecutivo con aire acondicionado, WiFi gratis, baños modernos, asientos reclinables 160° y servicio directo sin paradas intermedias. Máximo confort.',
        asientosMax: 40, // ← CAMBIADO A 40
        asientosDisponibles: 28, // ← CAMBIADO
        precio: 35 
      },
      { 
        id: 2, 
        nombre: '🚛 Camioneta 4x4 Guayaquil-Quito', 
        tipo: '🚛 Camioneta 4x4', 
        fecha: 'Viernes, 31 Enero 2026', 
        origen: 'Guayaquil - Centro', 
        destino: 'Quito - Norte', 
        horaSalida: '08:00', 
        descripcion: 'Toyota 4x4 con tracción total, aire acondicionado, 5 asientos de cuero. Ideal para viajes rápidos y cómodos.',
        asientosMax: 40,
        asientosDisponibles: 32, 
        precio: 65 
      }
    ];
  }

  // 🚌 10 FILAS x 4 ASIENTOS (A,B,C,D) = 40 ASIENTOS TOTALES
  generarAsientos() {
    this.asientos = [];
    
    for (let fila = 1; fila <= 10; fila++) { // ← CAMBIADO A 10 FILAS
      const letras = ['A', 'C', 'B', 'D']; // A,C = ventana | B,D = corredor
      
      for (let col = 0; col < 4; col++) {
        const estaOcupado = Math.random() < 0.3; // 30% ocupados
        
        this.asientos.push({
          id: (fila - 1) * 4 + col + 1,
          disponible: !estaOcupado,
          seleccionado: false,
          fila: fila,
          asiento: fila,
          letra: letras[col]
        });
      }
    }
  }

  // ✅ VISTA PASAJERO (10 FILAS DE ATRÁS A DELANTERA)
  getFilasReversas(): number[] {
    return [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // ← CAMBIADO A 10 FILAS
  }

  trackByFila(index: number, fila: number): number {
    return fila;
  }

  // ✅ ASIENTOS VENTANA (A,C) por fila
  getAsientosVentanaFila(fila: number): Asiento[] {
    return this.asientos.filter(a => 
      a.fila === fila && (a.letra === 'A' || a.letra === 'C')
    ).sort((a, b) => a.letra.localeCompare(b.letra));
  }

  // ✅ ASIENTOS CORREDOR (B,D) por fila
  getAsientosCorredorFila(fila: number): Asiento[] {
    return this.asientos.filter(a => 
      a.fila === fila && (a.letra === 'B' || a.letra === 'D')
    ).sort((a, b) => a.letra.localeCompare(b.letra));
  }

  // ✅ SELECCIÓN CON ALERTAS
  seleccionarAsiento(asiento: Asiento) {
    // Si está ocupado, mostrar alerta
    if (!asiento.disponible) {
      this.alertService.warning(
        'Asiento Ocupado', 
        'Este asiento ya está reservado. Por favor selecciona otro disponible.'
      );
      return;
    }
    
    const index = this.seleccionados.findIndex(s => s.id === asiento.id);
    
    if (index > -1) {
      // Deseleccionar
      this.seleccionados.splice(index, 1);
      asiento.seleccionado = false;
      
      // Toast de deselección
      this.alertService.toast('info', `Asiento ${asiento.asiento}${asiento.letra} deseleccionado`);
    } else {
      // Seleccionar
      this.seleccionados.push(asiento);
      asiento.seleccionado = true;
      
      // Toast de selección
      this.alertService.toast('success', `Asiento ${asiento.asiento}${asiento.letra} seleccionado`);
    }
  }

  // ✅ CLASE CSS PARA VISTA CLIENTE
  getClaseAsientoCliente(asiento: Asiento): string {
    if (asiento.seleccionado) {
      return 'seleccionado-cliente';
    }
    if (!asiento.disponible) {
      return 'ocupado-cliente';
    }
    return 'disponible';
  }

  get total(): number {
    return this.seleccionados.length * this.transporte.precio;
  }

  get puedeComprar(): boolean {
    return this.seleccionados.length > 0;
  }

  get asientosDisponibles(): number {
    return this.asientos.filter(a => a.disponible).length;
  }

  // ✅ AGREGAR AL CARRITO CON SWEETALERT2
  async agregarCarrito() {
    if (this.seleccionados.length === 0) {
      this.alertService.warning(
        'Sin Selección', 
        'Debes seleccionar al menos un asiento antes de continuar.'
      );
      return;
    }

    const asientosTexto = this.seleccionados
      .map(a => `${a.asiento}${a.letra}`)
      .sort()
      .join(', ');

    const itemCarrito = {
      tipo: 'transporte',
      id: this.transporte.id,
      nombre: this.transporte.nombre,
      asientos: this.seleccionados.map(a => ({
        numero: a.asiento,
        letra: a.letra,
        fila: a.fila
      })),
      cantidad: this.seleccionados.length,
      precioUnitario: this.transporte.precio,
      total: this.total,
      fechaViaje: this.transporte.fecha,
      ruta: `${this.transporte.origen} → ${this.transporte.destino}`
    };
    
    // Guardar en localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push(itemCarrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar alerta de éxito con opciones
    const result = await this.alertService.carritoAgregado(
      `${this.transporte.nombre}\nAsientos: ${asientosTexto}`,
      this.seleccionados.length,
      this.total
    );
    
    if (result.isConfirmed) {
      // Usuario clickeó "Ver Carrito"
      this.router.navigate(['/carrito']);
    } else {
      // Usuario clickeó "Seguir Comprando" - Reset
      this.seleccionados = [];
      this.asientos.forEach(a => a.seleccionado = false);
      
      // Toast de confirmación
      this.alertService.toast('success', 'Puedes seguir seleccionando asientos');
    }
  }

  volver() {
    this.router.navigate(['/eventos/transporte']);
  }

  // ✅ MÉTODO DE PRUEBA (OPCIONAL - PUEDES BORRAR DESPUÉS)
  probarAlertas() {
    console.log('🧪 Probando alertas...');
    
    // Success
    this.alertService.success('¡Funciona!', 'SweetAlert2 está correctamente instalado');
    
    // Toast después de 2 segundos
    setTimeout(() => {
      this.alertService.toast('success', 'Toast notification funcionando');
    }, 2000);
    
    // Confirmación después de 4 segundos
    setTimeout(() => {
      this.alertService.confirm('¿Confirmas?', 'Esta es una alerta de confirmación');
    }, 4000);
  }
}