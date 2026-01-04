import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  precio: number;
}

interface Asiento {
  id: number;
  disponible: boolean;
  seleccionado: boolean;
  fila: number;
  asiento: number;
}

@Component({
  selector: 'app-transporte-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transporte-detail.component.html',
  styleUrls: ['./transporte-detail.component.css']
})
export class TransporteDetailComponent implements OnInit {
  transporte: Transporte = {
    id: 1,
    nombre: 'Bus Ejecutivo QUITO-GUAYAQUIL',
    tipo: '🚌 Bus',
    fecha: 'Jueves 30 Enero 2026',
    origen: 'Quito (Terminal Quitumbe)',
    destino: 'Guayaquil (Terminal Terrestre)',
    horaSalida: '22:00',
    descripcion: 'Bus ejecutivo con aire acondicionado, WiFi gratis, baños, asientos reclinables 160°. Servicio directo sin paradas intermedias. Duración: 8 horas. Incluye snack nocturno y bebidas.',
    asientosMax: 40,
    precio: 35
  };

  asientos: Asiento[] = [];
  seleccionados: number[] = [];
  nombre = '';
  email = '';
  telefono = '';
  dni = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || 1);
    this.cargarTransporte(id);
    this.generarAsientos();
  }

  generarAsientos() {
    this.asientos = [];
    const asientosPorFila = Math.ceil(this.transporte.asientosMax / 2);
    
    let id = 1;
    for (let fila = 1; fila <= 2; fila++) {
      for (let asiento = 1; asiento <= asientosPorFila; asiento++) {
        if (id > this.transporte.asientosMax) break;
        this.asientos.push({
          id: id++,
          disponible: Math.random() > 0.2,
          seleccionado: false,
          fila: fila,
          asiento: asiento
        });
      }
    }
  }

  cargarTransporte(id: number) {
    const transportesData = [
      { 
        id: 1, 
        nombre: 'Bus Ejecutivo QUITO-GUAYAQUIL', 
        tipo: '🚌 Bus', 
        precio: 35, 
        asientosMax: 40, 
        fecha: 'Jueves 30 Enero 2026', 
        origen: 'Quito (Terminal Quitumbe)', 
        destino: 'Guayaquil (Terminal Terrestre)', 
        horaSalida: '22:00', 
        descripcion: 'Bus ejecutivo con aire acondicionado, WiFi gratis, baños, asientos reclinables 160°.' 
      },
      { 
        id: 2, 
        nombre: 'Camioneta 4x4 GYE-QUITO', 
        tipo: '🚛 Camioneta', 
        precio: 65, 
        asientosMax: 5, 
        fecha: 'Viernes 31 Enero 2026', 
        origen: 'Guayaquil (Centro)', 
        destino: 'Quito (Norte)', 
        horaSalida: '08:00', 
        descripcion: 'Camioneta 4x4 Toyota con tracción 4x4, aire acondicionado, 5 asientos cómodos.' 
      },
      { 
        id: 3, 
        nombre: 'Furgoneta Nocturna GYE-QUITO', 
        tipo: '🚐 Furgoneta', 
        precio: 28, 
        asientosMax: 12, 
        fecha: 'Miércoles 29 Enero 2026', 
        origen: 'Guayaquil (Terminal)', 
        destino: 'Quito (Quitumbe)', 
        horaSalida: '21:00', 
        descripcion: 'Furgoneta Mercedes Sprinter 12 pasajeros, asientos reclinables, baño, WiFi.' 
      },
      { 
        id: 4, 
        nombre: 'Auto Premium QUITO-GYE', 
        tipo: '🚗 Auto', 
        precio: 95, 
        asientosMax: 4, 
        fecha: 'Domingo 1 Febrero 2026', 
        origen: 'Quito (Aeropuerto)', 
        destino: 'Guayaquil (Centro)', 
        horaSalida: '14:00', 
        descripcion: 'Auto Toyota Camry Premium 4 pasajeros, máximo confort, aire acondicionado dual zone.' 
      },
      { 
        id: 5, 
        nombre: 'Bus Turístico QUITO-GUAYAQUIL', 
        tipo: '🚌 Bus', 
        precio: 42, 
        asientosMax: 45, 
        fecha: 'Lunes 2 Febrero 2026', 
        origen: 'Quito (Terminal)', 
        destino: 'Guayaquil (Terminal)', 
        horaSalida: '07:00', 
        descripcion: 'Bus turístico panorámico con paradas turísticas opcionales.' 
      },
      { 
        id: 6, 
        nombre: 'Camioneta Familiar GYE-CUENCA', 
        tipo: '🚛 Camioneta', 
        precio: 55, 
        asientosMax: 7, 
        fecha: 'Jueves 30 Enero 2026', 
        origen: 'Guayaquil (Terminal)', 
        destino: 'Cuenca (Terminal)', 
        horaSalida: '09:00', 
        descripcion: 'Camioneta familiar espaciosa, ideal para grupos pequeños.' 
      }
    ];
    this.transporte = transportesData.find(t => t.id === id) || this.transporte;
  }

  toggleAsiento(asiento: Asiento) {
    if (!asiento.disponible) return;
    asiento.seleccionado = !asiento.seleccionado;
    if (asiento.seleccionado) {
      this.seleccionados.push(asiento.id);
    } else {
      this.seleccionados = this.seleccionados.filter(id => id !== asiento.id);
    }
  }

  getClaseAsiento(asiento: Asiento): string {
    if (!asiento.disponible) return 'asiento ocupado';
    if (asiento.seleccionado) return 'asiento seleccionado';
    return 'asiento disponible';
  }

  get total(): number {
    return this.seleccionados.length * this.transporte.precio;
  }

  puedeComprar(): boolean {
    return this.seleccionados.length > 0 && 
           this.nombre.trim().length > 0 && 
           this.email.trim().length > 0 && 
           this.telefono.trim().length > 0 &&
           this.dni.trim().length > 0;
  }

  comprar() {
    if (!this.puedeComprar()) {
      alert('⚠️ Completa todos los campos y selecciona al menos 1 asiento');
      return;
    }
    alert(`🎉 ¡BOLETOS COMPRADOS!\n\n🚗 ${this.transporte.nombre}\n👤 ${this.nombre}\n📧 ${this.email}\n📱 ${this.telefono}\n🆔 ${this.dni}\n🎫 ${this.seleccionados.length} asientos ${this.transporte.tipo}\n💰 Total: $${this.total}\n\n¡Buen viaje!`);
    this.router.navigate(['/transporte']);
  }

  volver() {
    this.router.navigate(['/transporte']);
  }
}
