import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface TransporteRuta {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  origen: string;
  destino: string;
  precio: number;
  empresa?: string;
}

export abstract class TransportRepository {
  abstract getRutas(): Observable<TransporteRuta[]>;
  abstract getRuta(id: number): Observable<TransporteRuta | null>;
}

@Injectable()
export class TransportRepositoryImpl extends TransportRepository {
  private apiUrl = 'http://localhost:5000/transport';

  constructor(private http: HttpClient) { 
    super(); 
  }

  getRutas(): Observable<TransporteRuta[]> {
    console.log('🔍 Transport Repository: Conectando a', `${this.apiUrl}/rutas`);
    
    return this.http.get<any[]>(`${this.apiUrl}/rutas`).pipe(
      map(rutas => {
        console.log('✅ Transport Repository: Datos recibidos del backend:', rutas);
        
        if (!rutas || rutas.length === 0) {
          console.log('⚠️ No hay rutas en la base de datos');
          return [];
        }
        
        return rutas.map(r => ({
          id: r.idTransportRoute || r.id,
          nombre: r.routeName || 'Sin nombre',
          tipo: this.mapearTipo(r.transportType),
          fecha: r.createRoute || new Date().toISOString(),
          origen: r.origin || 'Origen desconocido',
          destino: r.destination || 'Destino desconocido',
          precio: r.estimatedDuration ? r.estimatedDuration * 0.5 : 30, // Precio estimado
          empresa: r.nameCompany || 'Empresa desconocida'
        }));
      }),
      catchError(error => {
        console.error('❌ Transport Repository: Error al conectar con el backend:', error);
        console.error('Detalles del error:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        return of([]);
      })
    );
  }

  getRuta(id: number): Observable<TransporteRuta | null> {
    return this.http.get<any[]>(`${this.apiUrl}/rutas`).pipe(
      map(rutas => {
        const ruta = rutas.find(r => r.idTransportRoute === id || r.id === id);
        if (ruta) {
          return {
            id: ruta.idTransportRoute || ruta.id,
            nombre: ruta.routeName || 'Sin nombre',
            tipo: this.mapearTipo(ruta.transportType),
            fecha: ruta.createRoute || new Date().toISOString(),
            origen: ruta.origin || 'Origen desconocido',
            destino: ruta.destination || 'Destino desconocido',
            precio: ruta.estimatedDuration ? ruta.estimatedDuration * 0.5 : 30,
            empresa: ruta.nameCompany || 'Empresa desconocida'
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error al obtener ruta:', error);
        return of(null);
      })
    );
  }

  private mapearTipo(transportType: string): string {
    const tipos: {[key: string]: string} = {
      'bus': '🚌 Bus',
      'metro': '🚇 Metro',
      'flight': '✈️ Vuelo',
      'train': '🚂 Tren',
      'taxi': '🚕 Taxi',
      'boat': '⛴️ Barco'
    };
    return tipos[transportType?.toLowerCase()] || '🚗 Auto';
  }
}