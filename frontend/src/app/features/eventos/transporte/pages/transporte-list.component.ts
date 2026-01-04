import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transporte {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  origen: string;
  destino: string;
  precio: number;
  asientosMax: number;
  asientosDisponibles?: number;
  destacado?: boolean;
}

@Component({
  selector: 'app-transporte-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transporte-list.component.html',
  styleUrls: ['./transporte-list.component.css']
})
export class TransporteListComponent implements OnInit {
  transportes: Transporte[] = [];
  filtered: Transporte[] = [];
  filtro = '';
  filtroOrigen = '';
  filtroDestino = '';
  filtroTipo = '';
  filtroFecha = '';
  loading = true;
  error = '';
  origenesUnicos: string[] = [];
  destinosUnicos: string[] = [];
  tiposUnicos: string[] = [];

  router = inject(Router);

  ngOnInit() {
    this.cargarTransportes();
  }

  private cargarTransportes() {
    this.loading = true;
    setTimeout(() => {
      this.transportes = this.getDatosDemo();
      this.extraerFiltrosUnicos();
      this.ordenarPorFecha();
      this.filtered = [...this.transportes];
      this.loading = false;
      console.log('✅ Transportes DEMO cargados:', this.transportes.length);
    }, 800);
  }

  private getDatosDemo(): Transporte[] {
    return [
      { 
        id: 1, 
        nombre: 'Bus Ejecutivo QUITO-GUAYAQUIL', 
        tipo: '🚌 Bus', 
        fecha: '2026-01-30', 
        origen: 'Quito', 
        destino: 'Guayaquil', 
        precio: 35, 
        asientosMax: 40, 
        asientosDisponibles: 28, 
        destacado: true 
      },
      { 
        id: 2, 
        nombre: 'Camioneta 4x4 GYE-QUITO', 
        tipo: '🚛 Camioneta', 
        fecha: '2026-01-31', 
        origen: 'Guayaquil', 
        destino: 'Quito', 
        precio: 65, 
        asientosMax: 5, 
        asientosDisponibles: 3, 
        destacado: true 
      },
      { 
        id: 3, 
        nombre: 'Furgoneta Nocturna GYE-QUITO', 
        tipo: '🚐 Furgoneta', 
        fecha: '2026-01-29', 
        origen: 'Guayaquil', 
        destino: 'Quito', 
        precio: 28, 
        asientosMax: 12, 
        asientosDisponibles: 8, 
        destacado: true 
      },
      { 
        id: 4, 
        nombre: 'Auto Premium QUITO-GYE', 
        tipo: '🚗 Auto', 
        fecha: '2026-02-01', 
        origen: 'Quito', 
        destino: 'Guayaquil', 
        precio: 95, 
        asientosMax: 4, 
        asientosDisponibles: 2, 
        destacado: false 
      },
      { 
        id: 5, 
        nombre: 'Bus Turístico QUITO-GUAYAQUIL', 
        tipo: '🚌 Bus', 
        fecha: '2026-02-02', 
        origen: 'Quito', 
        destino: 'Guayaquil', 
        precio: 42, 
        asientosMax: 45, 
        asientosDisponibles: 33, 
        destacado: false 
      },
      { 
        id: 6, 
        nombre: 'Camioneta Familiar GYE-CUENCA', 
        tipo: '🚛 Camioneta', 
        fecha: '2026-01-30', 
        origen: 'Guayaquil', 
        destino: 'Cuenca', 
        precio: 55, 
        asientosMax: 7, 
        asientosDisponibles: 5, 
        destacado: false 
      }
    ];
  }

  private extraerFiltrosUnicos() {
    this.origenesUnicos = [...new Set(this.transportes.map(t => t.origen))].sort();
    this.destinosUnicos = [...new Set(this.transportes.map(t => t.destino))].sort();
    this.tiposUnicos = [...new Set(this.transportes.map(t => t.tipo))].sort();
  }

  filtrar() {
    this.filtered = this.transportes.filter(t => {
      const nombreMatch = !this.filtro || 
        t.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
        t.origen.toLowerCase().includes(this.filtro.toLowerCase()) ||
        t.destino.toLowerCase().includes(this.filtro.toLowerCase());
      const origenMatch = !this.filtroOrigen || t.origen.toLowerCase().includes(this.filtroOrigen.toLowerCase());
      const destinoMatch = !this.filtroDestino || t.destino.toLowerCase().includes(this.filtroDestino.toLowerCase());
      const tipoMatch = !this.filtroTipo || t.tipo.includes(this.filtroTipo);
      const fechaMatch = !this.filtroFecha || t.fecha.includes(this.filtroFecha);
      return nombreMatch && origenMatch && destinoMatch && tipoMatch && fechaMatch;
    });
  }

  ordenarPorFecha() {
    this.transportes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  verDetalle(id: number) {
    this.router.navigate(['/transporte', id]);
  }

  getImagen(transporte: Transporte): string {
    switch(transporte.tipo) {
      case '🚌 Bus': 
        return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80';
      case '🚗 Auto': 
        return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80';
      case '🚛 Camioneta': 
        return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80';
      case '🚐 Furgoneta': 
        return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80';
      default: 
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80';
    }
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-EC', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  getBadgeColor(tipo: string = ''): string {
    const colores: {[key: string]: string} = {
      '🚌 Bus': 'linear-gradient(45deg, #10b981, #059669)',
      '🚗 Auto': 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
      '🚛 Camioneta': 'linear-gradient(45deg, #f59e0b, #d97706)',
      '🚐 Furgoneta': 'linear-gradient(45deg, #8b5cf6, #7c3aed)'
    };
    return colores[tipo] || 'linear-gradient(45deg, #6b7280, #4b5563)';
  }

  limpiarFiltros() {
    this.filtro = '';
    this.filtroOrigen = '';
    this.filtroDestino = '';
    this.filtroTipo = '';
    this.filtroFecha = '';
    this.filtrar();
  }

  getTransportesDestacados(): Transporte[] {
    return this.transportes.filter(t => t.destacado);
  }

  getTransportesNormales(): Transporte[] {
    return this.transportes.filter(t => !t.destacado);
  }
}
