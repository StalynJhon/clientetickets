import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../shared/services/alert.service'; // ← NUEVO

interface Asiento {
  id: number;
  zona: string;
  fila: number;
  numero: number;
  disponible: boolean;
  precio: number;
  seleccionado?: boolean;
}

interface ConciertoData {
  [key: number]: {
    nameConcert: string;
    nameArtist: string;
    fecha: string;
    ciudad: string;
    lugar: string;
    ticketPrice: number;
    genero: string;
  };
}

@Component({
  selector: 'app-concierto-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './concierto-detail.component.html',
  styleUrls: ['./concierto-detail.component.css']
})
export class ConciertoDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  alertService = inject(AlertService); // ← NUEVO: Inyectar servicio
  
  concierto: any = null;
  zonas: any[] = [];
  selectedAsientos: Asiento[] = [];
  loading = true; // ← NUEVO
  
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    console.log('🎯 ConciertoDetail - ID recibido:', id);
    
    // ✅ Mostrar loading
    this.alertService.loading('Cargando detalles del concierto...');
    this.loading = true;
    
    // Simular carga (puedes quitar el setTimeout si ya tienes datos reales)
    setTimeout(() => {
      this.cargarConcierto(id);
      
      // ✅ Cerrar loading
      this.alertService.close();
      this.loading = false;
    }, 800);
  }
  
  private cargarConcierto(id: number) {
    const datosConcierto: ConciertoData = {
      1: { 
        nameConcert: 'Bad Bunny - Un Verano Sin Ti Tour', 
        nameArtist: 'Bad Bunny', 
        fecha: '2026-02-15', 
        ciudad: 'Guayaquil', 
        lugar: 'Estadio Monumental', 
        ticketPrice: 75, 
        genero: 'Reggaetón' 
      },
      2: { 
        nameConcert: 'Taylor Swift - The Eras Tour', 
        nameArtist: 'Taylor Swift', 
        fecha: '2026-03-10', 
        ciudad: 'Quito', 
        lugar: 'Estadio Olímpico', 
        ticketPrice: 150, 
        genero: 'Pop' 
      },
      3: { 
        nameConcert: 'Coldplay - Music of the Spheres', 
        nameArtist: 'Coldplay', 
        fecha: '2026-04-20', 
        ciudad: 'Guayaquil', 
        lugar: 'Estadio Modelo', 
        ticketPrice: 120, 
        genero: 'Rock' 
      },
      4: { 
        nameConcert: 'Daddy Yankee - La Última Vuelta', 
        nameArtist: 'Daddy Yankee', 
        fecha: '2026-05-05', 
        ciudad: 'Quito', 
        lugar: 'Ágora de la Casa de la Cultura', 
        ticketPrice: 65, 
        genero: 'Reggaetón' 
      },
      5: { 
        nameConcert: 'Shakira - El Dorado World Tour', 
        nameArtist: 'Shakira', 
        fecha: '2026-06-18', 
        ciudad: 'Cuenca', 
        lugar: 'Estadio Alejandro Serrano', 
        ticketPrice: 95, 
        genero: 'Pop' 
      },
      6: { 
        nameConcert: 'Martin Garrix - RAI Amsterdam', 
        nameArtist: 'Martin Garrix', 
        fecha: '2026-07-30', 
        ciudad: 'Manta', 
        lugar: 'Malecon de Manta', 
        ticketPrice: 85, 
        genero: 'Electrónica' 
      }
    };
    
    this.concierto = {
      id,
      ...datosConcierto[id] || datosConcierto[1],
      entradasDisponibles: 1200
    };
    
    this.zonas = [
      { nombre: 'VIP', asientos: this.generarAsientos('VIP', 20, this.concierto.ticketPrice * 6.67) },
      { nombre: 'Preferencia', asientos: this.generarAsientos('Preferencia', 50, this.concierto.ticketPrice) },
      { nombre: 'Tribuna', asientos: this.generarAsientos('Tribuna', 100, this.concierto.ticketPrice * 0.5) }
    ];
    
    console.log('✅ Concierto cargado:', this.concierto.nameArtist);
  }
  
  generarAsientos(zona: string, total: number, precio: number): Asiento[] {
    const asientos: Asiento[] = [];
    for (let i = 1; i <= total; i++) {
      asientos.push({
        id: i,
        zona,
        fila: Math.floor(i / 10) + 1,
        numero: (i - 1) % 10 + 1,
        disponible: Math.random() > 0.2, // 80% disponibles, 20% ocupados
        precio
      });
    }
    return asientos;
  }
  
  toggleAsiento(asiento: Asiento) {
    // ✅ Si está ocupado, mostrar alerta
    if (!asiento.disponible) {
      this.alertService.warning(
        'Asiento Ocupado', 
        'Este asiento ya está reservado. Por favor selecciona otro disponible.'
      );
      return;
    }

    asiento.seleccionado = !asiento.seleccionado;
    const idx = this.selectedAsientos.findIndex(a => a.id === asiento.id && a.zona === asiento.zona);
    
    if (asiento.seleccionado && idx === -1) {
      this.selectedAsientos.push(asiento);
      
      // ✅ Toast de selección
      this.alertService.toast('success', `${asiento.zona} - Fila ${asiento.fila}, Asiento ${asiento.numero} seleccionado`);
    } else if (!asiento.seleccionado && idx > -1) {
      this.selectedAsientos.splice(idx, 1);
      
      // ✅ Toast de deselección
      this.alertService.toast('info', `${asiento.zona} - Fila ${asiento.fila}, Asiento ${asiento.numero} deseleccionado`);
    }
  }
  
  get total(): number {
    return this.selectedAsientos.reduce((sum, a) => sum + a.precio, 0);
  }
  
  async agregarAlCarrito() {
    // ✅ Validar que haya selección
    if (this.selectedAsientos.length === 0) {
      this.alertService.warning(
        'Sin Selección', 
        'Debes seleccionar al menos un asiento antes de continuar.'
      );
      return;
    }

    const asientosTexto = this.selectedAsientos
      .map(a => `${a.zona} - Fila ${a.fila}, Asiento ${a.numero}`)
      .join('\n');

    const ticket = {
      id: Date.now(),
      concierto: this.concierto,
      asientos: [...this.selectedAsientos],
      total: this.total
    };
    
    // Guardar en localStorage (opcional)
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push(ticket);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    console.log('🛒 Añadido:', ticket);
    
    // ✅ Mostrar alerta de éxito con opciones
    const result = await this.alertService.carritoAgregado(
      `${this.concierto.nameArtist} - ${this.concierto.nameConcert}`,
      this.selectedAsientos.length,
      this.total
    );
    
    if (result.isConfirmed) {
      // Usuario clickeó "Ver Carrito"
      this.router.navigate(['/carrito']);
    } else {
      // Usuario clickeó "Seguir Comprando" - Reset
      this.selectedAsientos.forEach(a => a.seleccionado = false);
      this.selectedAsientos = [];
      
      // Toast de confirmación
      this.alertService.toast('success', 'Puedes seguir seleccionando asientos');
    }
  }
  
  getDisponibles(asientos: Asiento[]): number {
    return asientos.filter(a => a.disponible).length;
  }

  volver() {
    this.router.navigate(['/eventos/conciertos']);
  }

  // ✅ MÉTODO DE PRUEBA (OPCIONAL - BORRAR DESPUÉS)
  probarAlertas() {
    this.alertService.success('¡Funciona!', 'SweetAlert2 está correctamente instalado');
    
    setTimeout(() => {
      this.alertService.toast('success', 'Toast notification funcionando');
    }, 2000);
    
    setTimeout(() => {
      this.alertService.confirm('¿Confirmas?', 'Esta es una alerta de confirmación');
    }, 4000);
  }
}