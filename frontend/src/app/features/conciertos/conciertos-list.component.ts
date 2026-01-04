import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Concierto {
  id: number;
  nameConcert: string;
  nameArtist: string;
  fecha: string;
  ciudad: string;
  lugar: string;
  ticketPrice: number;
}

@Component({
  selector: 'app-conciertos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conciertos-list.component.html',
  styleUrls: ['./conciertos-list.component.css']
})
export class ConciertosListComponent implements OnInit {
  conciertos: Concierto[] = [];
  filtered: Concierto[] = [];
  filtro = '';
  filtroCiudad = '';
  filtroFecha = '';
  loading = true;
  error = '';

  private http = inject(HttpClient);  // ← DIRECTO HttpClient

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarConciertos();
  }

  private cargarConciertos() {
    this.loading = true;
    this.http.get<Concierto[]>('http://localhost:5000/api/concerts').subscribe({
      next: (data: Concierto[]) => {
        this.conciertos = data;
        this.ordenarPorFecha();
        this.filtered = [...this.conciertos];
        this.loading = false;
        console.log('✅ Conciertos reales de backend:', data);
      },
      error: (err: any) => {
        console.error('❌ Backend error:', err);
        this.error = 'Backend no responde. Usando datos demo.';
        this.loading = false;
        // Datos demo como fallback
        this.conciertos = [
          { id: 1, nameConcert: 'Bad Bunny - Un Verano Sin Ti', nameArtist: 'Bad Bunny', fecha: '2026-02-15', ciudad: 'Guayaquil', lugar: 'Estadio Monumental', ticketPrice: 75 },
          { id: 2, nameConcert: 'Taylor Swift - The Eras Tour', nameArtist: 'Taylor Swift', fecha: '2026-03-10', ciudad: 'Quito', lugar: 'Estadio Olímpico', ticketPrice: 150 }
        ];
        this.filtered = [...this.conciertos];
      }
    });
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
      return nombreMatch && ciudadMatch && fechaMatch;
    });
  }

  ordenarPorFecha() {
    this.conciertos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  verDetalle(id: number) {
    this.router.navigate(['/conciertos', id]);
  }

  getImagen(c: Concierto): string {
    return `https://via.placeholder.com/400x250/667eea/ffffff?text=${encodeURIComponent(c.nameArtist)}`;
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-EC', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  }

  limpiarFiltros() {
    this.filtro = '';
    this.filtroCiudad = '';
    this.filtroFecha = '';
    this.filtrar();
  }
}
