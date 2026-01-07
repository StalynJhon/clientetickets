import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransportService } from '../transport.service';
import { AlertService } from '../../../../shared/services/alert.service'; // ← AGREGADO

interface Transporte {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  origen: string;
  destino: string;
  precio: number;
  asientosMax?: number;
  asientosDisponibles?: number;
  destacado?: boolean;
  empresa?: string;
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
  transportService = inject(TransportService);
  alertService = inject(AlertService); // ← AGREGADO

  ngOnInit() {
    this.cargarTransportes();
  }

  private cargarTransportes() {
    console.log('📱 Componente: Cargando transportes...');
    this.loading = true;
    
    // ← AGREGADO: Mostrar loading
    this.alertService.loading('Cargando transportes...');
    
    this.transportService.getTransportes().subscribe({
      next: (transportes) => {
        console.log('✅ Componente: Transportes recibidos:', transportes);
        
        // ← AGREGADO: Cerrar loading
        this.alertService.close();
        
        if (transportes.length === 0) {
          console.log('⚠️ No hay transportes en BD. Usando datos demo.');
          this.transportes = this.transportService.getDatosDemo();
          this.error = 'No hay transportes en la base de datos. Mostrando datos de ejemplo.';
          
          // ← AGREGADO: Info toast
          this.alertService.info(
            'Datos de Demostración',
            'No hay transportes en la base de datos. Mostrando vehículos de ejemplo.'
          );
        } else {
          this.transportes = transportes;
          this.error = '';
          
          // ← AGREGADO: Success toast
          this.alertService.toast('success', `${transportes.length} transportes cargados`);
        }
        
        this.extraerFiltrosUnicos();
        this.ordenarPorFecha();
        this.filtered = [...this.transportes];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Componente: Error al cargar transportes:', err);
        
        // ← AGREGADO: Cerrar loading
        this.alertService.close();
        
        // ← AGREGADO: Warning
        this.alertService.warning(
          'Modo Sin Conexión',
          'No se pudo conectar con el servidor. Mostrando datos de ejemplo.'
        );
        
        this.error = 'No se pudo conectar con el servidor. Mostrando datos de ejemplo.';
        this.transportes = this.transportService.getDatosDemo();
        this.extraerFiltrosUnicos();
        this.ordenarPorFecha();
        this.filtered = [...this.transportes];
        this.loading = false;
      }
    });
  }

  private extraerFiltrosUnicos() {
    // ← OPCIONAL: Usar métodos del service
    this.origenesUnicos = this.transportService.getOrigenesUnicos(this.transportes);
    this.destinosUnicos = this.transportService.getDestinosUnicos(this.transportes);
    this.tiposUnicos = this.transportService.getTiposUnicos(this.transportes);
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

    // ← AGREGADO: Toast cuando no hay resultados
    if (this.filtered.length === 0 && (this.filtro || this.filtroOrigen || this.filtroDestino || this.filtroTipo || this.filtroFecha)) {
      this.alertService.toast('info', 'No se encontraron transportes con esos filtros');
    }
  }

  ordenarPorFecha() {
    this.transportes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  verDetalle(id: number) {
    this.router.navigate(['/transporte', id]);
  }

  getImagen(transporte: Transporte): string {
    const tipo = transporte.tipo?.toLowerCase() || '';
    
    if (tipo.includes('bus') || tipo.includes('🚌')) {
      const imagenesBus = [
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80'
      ];
      return imagenesBus[transporte.id % imagenesBus.length];
    }
    
    if (tipo.includes('auto') || tipo.includes('🚗')) {
      const imagenesAuto = [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80'
      ];
      return imagenesAuto[transporte.id % imagenesAuto.length];
    }
    
    if (tipo.includes('camioneta') || tipo.includes('🚛')) {
      const imagenesCamioneta = [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format&fit=crop&q=80'
      ];
      return imagenesCamioneta[transporte.id % imagenesCamioneta.length];
    }
    
    if (tipo.includes('furgoneta') || tipo.includes('🚐') || tipo.includes('van')) {
      const imagenesFurgoneta = [
        'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&auto=format&fit=crop&q=80'
      ];
      return imagenesFurgoneta[transporte.id % imagenesFurgoneta.length];
    }
    
    return 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80';
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
    
    // ← AGREGADO: Toast de confirmación
    this.alertService.toast('success', 'Filtros limpiados');
  }

  getTransportesDestacados(): Transporte[] {
    return this.transportes.filter(t => t.destacado);
  }

  getTransportesNormales(): Transporte[] {
    return this.transportes.filter(t => !t.destacado);
  }
}