import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
}

@Component({
  selector: 'app-transporte-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transporte-list.component.html',
  styleUrls: ['./transporte-list.component.css']
})
export class TransporteListComponent implements OnInit {
  transportes: Transporte[] = [
    { id: 1, nombre: 'Bus Ejecutivo QUITO-GUAYAQUIL', tipo: '🚌 Bus', fecha: '2026-01-30', origen: 'Quito', destino: 'Guayaquil', precio: 35, asientosMax: 40 },
    { id: 2, nombre: 'Camioneta 4x4 GYE-QUITO', tipo: '🚛 Camioneta', fecha: '2026-01-31', origen: 'Guayaquil', destino: 'Quito', precio: 65, asientosMax: 5 },
    { id: 3, nombre: 'Furgoneta Nocturna GYE-QUITO', tipo: '🚐 Furgoneta', fecha: '2026-01-29', origen: 'Guayaquil', destino: 'Quito', precio: 28, asientosMax: 12 },
    { id: 4, nombre: 'Auto Premium QUITO-GYE', tipo: '🚗 Auto', fecha: '2026-02-01', origen: 'Quito', destino: 'Guayaquil', precio: 95, asientosMax: 4 },
    { id: 5, nombre: 'Bus Turístico QUITO-GUAYAQUIL', tipo: '🚌 Bus', fecha: '2026-02-02', origen: 'Quito', destino: 'Guayaquil', precio: 42, asientosMax: 45 },
    { id: 6, nombre: 'Camioneta Familiar GYE-CUENCA', tipo: '🚛 Camioneta', fecha: '2026-01-30', origen: 'Guayaquil', destino: 'Cuenca', precio: 55, asientosMax: 7 }
  ];
  
  filtered: Transporte[] = [];
  filtro = '';
  filtroOrigen = '';
  filtroDestino = '';
  filtroTipo = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.filtered = [...this.transportes];
  }

  filtrar() {
    this.filtered = this.transportes.filter(t => {
      const match = !this.filtro || 
        t.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
        t.origen.toLowerCase().includes(this.filtro.toLowerCase()) ||
        t.destino.toLowerCase().includes(this.filtro.toLowerCase());
      const origenMatch = !this.filtroOrigen || t.origen.toLowerCase().includes(this.filtroOrigen.toLowerCase());
      const destinoMatch = !this.filtroDestino || t.destino.toLowerCase().includes(this.filtroDestino.toLowerCase());
      const tipoMatch = !this.filtroTipo || t.tipo.includes(this.filtroTipo);
      return match && origenMatch && destinoMatch && tipoMatch;
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/transporte', id]);
  }

  getImagen(t: Transporte): string {
    // ✅ SOLUCIÓN TypeScript - Switch sin errores
    switch(t.tipo) {
      case '🚌 Bus': return 'https://via.placeholder.com/400x250/10b981/ffffff?text=Bus';
      case '🚗 Auto': return 'https://via.placeholder.com/400x250/3b82f6/ffffff?text=Auto';
      case '🚛 Camioneta': return 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=Camioneta';
      case '🚐 Furgoneta': return 'https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Furgoneta';
      default: return 'https://via.placeholder.com/400x250/10b981/ffffff?text=Transporte';
    }
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-EC', { 
      day: 'numeric', month: 'short' 
    });
  }

  limpiarFiltros() {
    this.filtro = '';
    this.filtroOrigen = '';
    this.filtroDestino = '';
    this.filtroTipo = '';
    this.filtrar();
  }
}
