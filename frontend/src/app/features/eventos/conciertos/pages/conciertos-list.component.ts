import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../../eventos.service';

interface Concierto {
  id: number;
  nameConcert: string;
  nameArtist: string;
  fecha: string;
  ciudad: string;
  lugar: string;
  ticketPrice: number;
  genero?: string;
  entradasDisponibles?: number;
  destacado?: boolean;
}

@Component({
  selector: 'app-conciertos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './conciertos-list.component.html',
  styleUrls: ['./conciertos-list.component.css']
})
export class ConciertosListComponent implements OnInit {
  conciertos: Concierto[] = [];
  filtered: Concierto[] = [];
  filtro = '';
  filtroCiudad = '';
  filtroFecha = '';
  filtroGenero = '';
  loading = true;
  error = '';
  ciudadesUnicas: string[] = [];
  generosUnicos: string[] = [];

  eventosService = inject(EventosService);
  router = inject(Router);

  ngOnInit() {
    this.cargarConciertos();
  }

  private cargarConciertos() {
    this.loading = true;
    this.eventosService.getEventos().subscribe({
      next: (data: Concierto[]) => {
        this.conciertos = this.añadirDatosDemo(data);
        this.extraerFiltrosUnicos();
        this.ordenarPorFecha();
        this.filtered = [...this.conciertos];
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Backend no responde. Usando datos demo.';
        this.loading = false;
        this.conciertos = this.getDatosDemo();
        this.extraerFiltrosUnicos();
        this.filtered = [...this.conciertos];
      }
    });
  }

  private añadirDatosDemo(conciertos: Concierto[]): Concierto[] {
    const generos = ['Pop', 'Rock', 'Reggaetón', 'Electrónica', 'Hip Hop', 'Indie'];
    return conciertos.map((c, i) => ({
      ...c,
      genero: generos[i % generos.length],
      entradasDisponibles: Math.floor(Math.random() * 100) + 20,
      destacado: i < 3
    }));
  }

  private getDatosDemo(): Concierto[] {
    return [
      { 
        id: 1, 
        nameConcert: 'Bad Bunny - Un Verano Sin Ti Tour', 
        nameArtist: 'Bad Bunny', 
        fecha: '2026-02-15', 
        ciudad: 'Guayaquil', 
        lugar: 'Estadio Monumental', 
        ticketPrice: 75,
        genero: 'Reggaetón',
        entradasDisponibles: 45,
        destacado: true
      },
      { 
        id: 2, 
        nameConcert: 'Taylor Swift - The Eras Tour', 
        nameArtist: 'Taylor Swift', 
        fecha: '2026-03-10', 
        ciudad: 'Quito', 
        lugar: 'Estadio Olímpico', 
        ticketPrice: 150,
        genero: 'Pop',
        entradasDisponibles: 32,
        destacado: true
      },
      { 
        id: 3, 
        nameConcert: 'Coldplay - Music of the Spheres', 
        nameArtist: 'Coldplay', 
        fecha: '2026-04-20', 
        ciudad: 'Guayaquil', 
        lugar: 'Estadio Modelo', 
        ticketPrice: 120,
        genero: 'Rock',
        entradasDisponibles: 78,
        destacado: true
      },
      { 
        id: 4, 
        nameConcert: 'Daddy Yankee - La Última Vuelta', 
        nameArtist: 'Daddy Yankee', 
        fecha: '2026-05-05', 
        ciudad: 'Quito', 
        lugar: 'Ágora de la Casa de la Cultura', 
        ticketPrice: 65,
        genero: 'Reggaetón',
        entradasDisponibles: 15
      },
      { 
        id: 5, 
        nameConcert: 'Shakira - El Dorado World Tour', 
        nameArtist: 'Shakira', 
        fecha: '2026-06-18', 
        ciudad: 'Cuenca', 
        lugar: 'Estadio Alejandro Serrano', 
        ticketPrice: 95,
        genero: 'Pop',
        entradasDisponibles: 62
      },
      { 
        id: 6, 
        nameConcert: 'Martin Garrix - RAI Amsterdam', 
        nameArtist: 'Martin Garrix', 
        fecha: '2026-07-30', 
        ciudad: 'Manta', 
        lugar: 'Malecon de Manta', 
        ticketPrice: 85,
        genero: 'Electrónica',
        entradasDisponibles: 41
      }
    ];
  }

  private extraerFiltrosUnicos() {
    this.ciudadesUnicas = [...new Set(this.conciertos.map(c => c.ciudad))].sort();
    this.generosUnicos = [...new Set(this.conciertos.map(c => c.genero || 'Otro'))].sort();
  }

  filtrar() {
    this.filtered = this.conciertos.filter(c => {
      const nombreMatch = !this.filtro || 
        c.nameConcert.toLowerCase().includes(this.filtro.toLowerCase()) ||
        c.nameArtist.toLowerCase().includes(this.filtro.toLowerCase());
      const ciudadMatch = !this.filtroCiudad || 
        c.ciudad.toLowerCase().includes(this.filtroCiudad.toLowerCase());
      const fechaMatch = !this.filtroFecha || 
        c.fecha.includes(this.filtroFecha);
      const generoMatch = !this.filtroGenero || 
        c.genero?.toLowerCase().includes(this.filtroGenero.toLowerCase());
      return nombreMatch && ciudadMatch && fechaMatch && generoMatch;
    });
  }

  ordenarPorFecha() {
    this.conciertos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  // ✅ SIN ALERTA - NAVEGACIÓN LIMPIA
  verDetalle(id: number) {
    this.router.navigate(['/conciertos', id]);
  }

  getImagen(concierto: Concierto): string {
    const artistas = ['Bad Bunny', 'Taylor Swift', 'Coldplay', 'Daddy Yankee', 'Shakira', 'Martin Garrix'];
    const indice = artistas.indexOf(concierto.nameArtist);
    const imagenes = [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    return indice >= 0 ? imagenes[indice] : `https://via.placeholder.com/800x500/667eea/ffffff?text=${encodeURIComponent(concierto.nameArtist)}`;
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-EC', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getBadgeColor(genero: string = ''): string {
    const colores: {[key: string]: string} = {
      'Reggaetón': 'linear-gradient(45deg, #ff0080, #ff8c00)',
      'Pop': 'linear-gradient(45deg, #00d4ff, #8a2be2)',
      'Rock': 'linear-gradient(45deg, #ff416c, #ff4b2b)',
      'Electrónica': 'linear-gradient(45deg, #00b09b, #96c93d)',
      'Hip Hop': 'linear-gradient(45deg, #8e2de2, #4a00e0)',
      'Indie': 'linear-gradient(45deg, #f46b45, #eea849)'
    };
    return colores[genero] || 'linear-gradient(45deg, #667eea, #764ba2)';
  }

  limpiarFiltros() {
    this.filtro = '';
    this.filtroCiudad = '';
    this.filtroFecha = '';
    this.filtroGenero = '';
    this.filtrar();
  }

  getConciertosDestacados(): Concierto[] {
    return this.conciertos.filter(c => c.destacado);
  }

  getConciertosNormales(): Concierto[] {
    return this.conciertos.filter(c => !c.destacado);
  }
}
