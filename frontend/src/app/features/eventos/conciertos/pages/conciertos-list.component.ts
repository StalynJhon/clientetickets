import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConcertRepository } from '../../../../data/repositories/concert.repository.impl';
import { AlertService } from '../../../../shared/services/alert.service';

interface Concierto {
  id: number;
  nombre?: string;
  nameConcert?: string;
  nameArtist?: string;
  artista?: string;
  fecha: string;
  ciudad: string;
  lugar?: string;
  precio?: number;
  ticketPrice?: number;
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

  concertRepository = inject(ConcertRepository);
  router = inject(Router);
  alertService = inject(AlertService);

  ngOnInit() {
    this.cargarConciertos();
  }

  private cargarConciertos() {
    this.loading = true;
    this.alertService.loading('Cargando conciertos...');
    
    console.log('📱 Componente: Cargando conciertos...');
    
    this.concertRepository.getConciertos().subscribe({
      next: (data: any[]) => {
        console.log('📱 Componente: Datos recibidos', data);
        this.alertService.close();
        
        if (data && data.length > 0) {
          this.conciertos = this.normalizarConciertos(data);
          this.error = '';
          this.alertService.toast('success', `${data.length} conciertos cargados`);
        } else {
          console.log('⚠️ No hay datos en BD, usando demo');
          this.conciertos = this.getDatosDemo();
          this.alertService.info(
            'Datos de Demostración', 
            'No hay conciertos en la base de datos. Mostrando eventos de ejemplo.'
          );
        }
        
        this.extraerFiltrosUnicos();
        this.ordenarPorFecha();
        this.filtered = [...this.conciertos];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Componente: Error al cargar', err);
        this.alertService.close();
        this.alertService.warning(
          'Modo Offline',
          'No se pudo conectar con el servidor. Mostrando datos de ejemplo.'
        );
        
        this.loading = false;
        this.conciertos = this.getDatosDemo();
        this.extraerFiltrosUnicos();
        this.filtered = [...this.conciertos];
      }
    });
  }

  private normalizarConciertos(data: any[]): Concierto[] {
    const generos = ['Pop', 'Rock', 'Reggaetón', 'Electrónica', 'Hip Hop', 'Indie'];
    
    return data.map((c, i) => ({
      id: c.id || i,
      nameConcert: c.nombre || c.nameConcert || 'Sin nombre',
      nameArtist: c.artista || c.nameArtist || 'Artista desconocido',
      fecha: c.fecha || new Date().toISOString().split('T')[0],
      ciudad: c.ciudad || 'Ciudad no especificada',
      lugar: c.lugar || 'Lugar no especificado',
      ticketPrice: c.precio || c.ticketPrice || 0,
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

  // ✅ FILTRADO IGUAL QUE TRANSPORTE
  filtrar() {
    this.filtered = this.conciertos.filter(c => {
      const nombreConcierto = c.nameConcert || c.nombre || '';
      const nombreArtista = c.nameArtist || c.artista || '';
      
      const nombreMatch = !this.filtro || 
        nombreConcierto.toLowerCase().includes(this.filtro.toLowerCase()) ||
        nombreArtista.toLowerCase().includes(this.filtro.toLowerCase());
      
      const ciudadMatch = !this.filtroCiudad || 
        c.ciudad.toLowerCase().includes(this.filtroCiudad.toLowerCase());
      
      const fechaMatch = !this.filtroFecha || 
        c.fecha.includes(this.filtroFecha);
      
      const generoMatch = !this.filtroGenero || 
        (c.genero || '').toLowerCase().includes(this.filtroGenero.toLowerCase());
      
      return nombreMatch && ciudadMatch && fechaMatch && generoMatch;
    });

    // Toast cuando no hay resultados
    if (this.filtered.length === 0 && (this.filtro || this.filtroCiudad || this.filtroFecha || this.filtroGenero)) {
      this.alertService.toast('info', 'No se encontraron conciertos con esos filtros');
    }
  }

  ordenarPorFecha() {
    this.conciertos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  getImagen(concierto: Concierto): string {
    const artistName = (concierto.nameArtist || concierto.artista || '').toLowerCase();
    
    if (artistName.includes('bad bunny')) {
      return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80';
    }
    if (artistName.includes('coldplay')) {
      return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80';
    }
    if (artistName.includes('karol')) {
      return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80';
    }
    if (artistName.includes('taylor') || artistName.includes('swift')) {
      return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
    }
    if (artistName.includes('daddy') || artistName.includes('yankee')) {
      return 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop&q=80';
    }
    if (artistName.includes('shakira')) {
      return 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&auto=format&fit=crop&q=80';
    }
    if (artistName.includes('martin') || artistName.includes('garrix')) {
      return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80';
    }
    
    const imagenes = [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80'
    ];
    
    const index = concierto.id ? (concierto.id - 1) % imagenes.length : 0;
    return imagenes[index];
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
    this.alertService.toast('success', 'Filtros limpiados');
  }

  getConciertosDestacados(): Concierto[] {
    return this.filtered.filter(c => c.destacado);
  }

  getConciertosNormales(): Concierto[] {
    return this.filtered.filter(c => !c.destacado);
  }
}