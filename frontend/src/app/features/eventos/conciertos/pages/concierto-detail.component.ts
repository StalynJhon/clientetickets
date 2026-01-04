import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  
  concierto: any = null;
  zonas: any[] = [];
  selectedAsientos: Asiento[] = [];
  
  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    console.log('🎯 ConciertoDetail - ID recibido:', id);
    
    // ✅ FIJADO: Index signature con [key: number]
    const datosConcierto: ConciertoData = {
      1: { nameConcert: 'Bad Bunny - Un Verano Sin Ti Tour', nameArtist: 'Bad Bunny', 
           fecha: '2026-02-15', ciudad: 'Guayaquil', lugar: 'Estadio Monumental', 
           ticketPrice: 75, genero: 'Reggaetón' },
      2: { nameConcert: 'Taylor Swift - The Eras Tour', nameArtist: 'Taylor Swift', 
           fecha: '2026-03-10', ciudad: 'Quito', lugar: 'Estadio Olímpico', 
           ticketPrice: 150, genero: 'Pop' },
      3: { nameConcert: 'Coldplay - Music of the Spheres', nameArtist: 'Coldplay', 
           fecha: '2026-04-20', ciudad: 'Guayaquil', lugar: 'Estadio Modelo', 
           ticketPrice: 120, genero: 'Rock' }
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
        disponible: Math.random() > 0.2,
        precio
      });
    }
    return asientos;
  }
  
  toggleAsiento(asiento: Asiento) {
    if (asiento.disponible) {
      asiento.seleccionado = !asiento.seleccionado;
      const idx = this.selectedAsientos.findIndex(a => a.id === asiento.id);
      if (asiento.seleccionado && idx === -1) {
        this.selectedAsientos.push(asiento);
      } else if (!asiento.seleccionado && idx > -1) {
        this.selectedAsientos.splice(idx, 1);
      }
    }
  }
  
  get total(): number {
    return this.selectedAsientos.reduce((sum, a) => sum + a.precio, 0);
  }
  
  agregarAlCarrito() {
    const ticket = {
      id: Date.now(),
      concierto: this.concierto,
      asientos: [...this.selectedAsientos],
      total: this.total
    };
    console.log('🛒 Añadido:', ticket);
    alert(`✅ ${this.selectedAsientos.length} asientos al carrito! $${this.total}`);
    this.router.navigate(['/carrito']);
  }
  
  getDisponibles(asientos: Asiento[]): number {
    return asientos.filter(a => a.disponible).length;
  }
}
