import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Concierto {
  id: number;
  nombre: string;
  fecha: string;
  // Campos adicionales que puedes necesitar
  artista?: string;
  ciudad?: string;
  precio?: number;
}

export abstract class ConcertRepository {
  abstract getConciertos(): Observable<Concierto[]>;
}

@Injectable()
export class ConcertRepositoryImpl extends ConcertRepository {
  private apiUrl = 'http://localhost:5000/concert';

  constructor(private http: HttpClient) { 
    super(); 
  }

  getConciertos(): Observable<Concierto[]> {
    console.log('🔍 Repository: Conectando a', `${this.apiUrl}/conciertos`);
    
    return this.http.get<any[]>(`${this.apiUrl}/conciertos`).pipe(
      map(conciertos => {
        console.log('✅ Repository: Datos recibidos', conciertos);
        
        if (!conciertos || conciertos.length === 0) {
          console.log('⚠️ Repository: No hay conciertos en la BD');
          return [];
        }
        
        // Mapear los datos del backend al formato que usa tu componente
        return conciertos.map(c => ({
          id: c.idConcert || c.id,
          nombre: c.nameConcert || 'Sin nombre',
          fecha: c.dateConcert || new Date().toISOString(),
          artista: c.nameArtist || 'Artista desconocido',
          ciudad: c.addressVenue || c.nameVenue || 'Ciudad desconocida',
          precio: c.ticketPrice || 0
        }));
      }),
      catchError(error => {
        console.error('❌ Repository: Error al conectar', error);
        console.error('Detalles:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        // Retornar array vacío si hay error
        return of([]);
      })
    );
  }
}