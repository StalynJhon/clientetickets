import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  
  transporte: Transporte = {} as Transporte;
  asientos: Asiento[] = [];
  seleccionados: Asiento[] = []; // ✅ CAMBIADO a objetos completos
  loading = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || '1');
    this.cargarTransporte(id);
  }

  private cargarTransporte(id: number) {
    this.loading = true;
    setTimeout(() => {
      const datos = this.getDatosDemo();
      this.transporte = datos[id - 1] || datos[0];
      this.generarAsientos();
      this.loading = false;
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
        asientosMax: 16, 
        asientosDisponibles: 12, 
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
        asientosMax: 5, 
        asientosDisponibles: 3, 
        precio: 65 
      }
    ];
  }

  // 🚌 4 FILAS x 4 ASIENTOS (A,B,C,D) - SIN PASILLO FAKE
  generarAsientos() {
    this.asientos = [];
    
    for (let fila = 1; fila <= 4; fila++) {
      const letras = ['A', 'B', 'C', 'D'];
      
      for (let col = 0; col < 4; col++) {
        this.asientos.push({
          id: (fila - 1) * 4 + col + 1,
          disponible: Math.random() > 0.2,
          seleccionado: false,
          fila: fila,
          asiento: (fila - 1) * 4 + col + 1,
          letra: letras[col]
        });
      }
    }
  }

  // ✅ NUEVO: VISTA PASAJERO (FILAS DE ATRÁS A DELANTERA)
  getFilasReversas(): number[] {
    return [4, 3, 2, 1];
  }

  trackByFila(index: number, fila: number): number {
    return fila;
  }

  // ✅ ASIENTOS VENTANA (A,C) por fila
  getAsientosVentanaFila(fila: number): Asiento[] {
    return this.asientos.filter(a => 
      a.fila === fila && (a.letra === 'A' || a.letra === 'C')
    );
  }

  // ✅ ASIENTOS CORREDOR (B,D) por fila
  getAsientosCorredorFila(fila: number): Asiento[] {
    return this.asientos.filter(a => 
      a.fila === fila && (a.letra === 'B' || a.letra === 'D')
    );
  }

  // ✅ SELECCIÓN DESDE VISTA PASAJERO
  seleccionarAsiento(asiento: Asiento) {
    if (!asiento.disponible) return;
    
    const index = this.seleccionados.findIndex(s => s.id === asiento.id);
    
    if (index > -1) {
      // Deseleccionar
      this.seleccionados.splice(index, 1);
      asiento.seleccionado = false;
    } else {
      // Seleccionar (máximo 4)
      if (this.seleccionados.length < 4) {
        this.seleccionados.push(asiento);
        asiento.seleccionado = true;
      }
    }
  }

  // ✅ CLASE CSS PARA VISTA CLIENTE
  getClaseAsientoCliente(asiento: Asiento): string {
    let clases = ['asiento-pasajero'];
    
    if (!asiento.disponible) {
      clases.push('ocupado');
    } else if (asiento.seleccionado) {
      clases.push('seleccionado');
    } else {
      clases.push('disponible');
    }
    
    return clases.join(' ');
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

  agregarCarrito() {
    if (this.seleccionados.length === 0) {
      alert('⚠️ Selecciona al menos 1 asiento');
      return;
    }

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
    
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push(itemCarrito);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    alert(`✅ ${this.seleccionados.length} asiento(s) agregados al carrito!\n💰 Total: $${this.total}`);
    
    // Reset
    this.seleccionados = [];
    this.asientos.forEach(a => a.seleccionado = false);
  }

  volver() {
    this.router.navigate(['/transporte']);
  }
}
