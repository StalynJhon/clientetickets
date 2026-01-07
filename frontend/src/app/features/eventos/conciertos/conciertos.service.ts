import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Concierto {
  id: number;
  nameConcert: string;
  nameArtist: string;
  city: string;
  ticketPrice: number;
}

@Injectable({ providedIn: 'root' })
export class ConciertosService {
  // URL del backend
  private apiUrl = 'http://localhost:5000/concert';

  constructor(private http: HttpClient) {}

  // Obtener todos los conciertos
  getConciertos(): Observable<Concierto[]> {
    console.log('🔍 Intentando conectar a:', `${this.apiUrl}/conciertos`);
    
    return this.http.get<any[]>(`${this.apiUrl}/conciertos`).pipe(
      map(conciertos => {
        console.log('✅ Datos recibidos del backend:', conciertos);
        
        if (!conciertos || conciertos.length === 0) {
          console.log('⚠️ No hay conciertos en la base de datos');
          return [];
        }
        
        return conciertos.map(c => ({
          id: c.idConcert || c.id,
          nameConcert: c.nameConcert || 'Sin nombre',
          nameArtist: c.nameArtist || 'Artista desconocido',
          city: c.addressVenue || c.nameVenue || 'Ciudad desconocida',
          ticketPrice: c.ticketPrice || 0
        }));
      }),
      catchError(error => {
        console.error('❌ Error al conectar con el backend:', error);
        console.error('Detalles del error:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        
        // Retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  // Obtener un concierto por ID
  getConcierto(id: number): Observable<Concierto> {
    return this.http.get<any[]>(`${this.apiUrl}/conciertos`).pipe(
      map(conciertos => {
        const concierto = conciertos.find(c => c.idConcert === id);
        if (concierto) {
          return {
            id: concierto.idConcert,
            nameConcert: concierto.nameConcert,
            nameArtist: concierto.nameArtist,
            city: concierto.addressVenue,
            ticketPrice: concierto.ticketPrice
          };
        }
        return {
          id: id,
          nameConcert: 'No encontrado',
          nameArtist: 'N/A',
          city: 'N/A',
          ticketPrice: 0
        };
      }),
      catchError(error => {
        console.error('Error al obtener concierto:', error);
        return of({
          id: id,
          nameConcert: 'Error',
          nameArtist: 'N/A',
          city: 'N/A',
          ticketPrice: 0
        });
      })
    );
  }
}