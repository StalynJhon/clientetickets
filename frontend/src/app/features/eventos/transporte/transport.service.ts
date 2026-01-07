import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Transporte {
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

@Injectable({ providedIn: 'root' })
export class TransportService {
  // URL del backend
  private apiUrl = 'http://localhost:5000/transport';

  constructor(private http: HttpClient) {}

  // Obtener todos los transportes
  getTransportes(): Observable<Transporte[]> {
    console.log('🔍 Intentando conectar a:', `${this.apiUrl}/rutas`);
    
    return this.http.get<any[]>(`${this.apiUrl}/rutas`).pipe(
      map(rutas => {
        console.log('✅ Datos recibidos del backend:', rutas);
        
        if (!rutas || rutas.length === 0) {
          console.log('⚠️ No hay rutas en la base de datos');
          return [];
        }
        
        return rutas.map((r, index) => ({
          id: r.id || index + 1,
          nombre: r.nombre || 'Transporte sin nombre',
          tipo: r.tipo || '🚌 Bus',
          fecha: r.fecha || new Date().toISOString().split('T')[0],
          origen: r.origen || 'Origen no especificado',
          destino: r.destino || 'Destino no especificado',
          precio: r.precio || 0,
          empresa: r.empresa || 'Empresa de transporte',
          asientosMax: r.asientosMax || 40,
          asientosDisponibles: r.asientosDisponibles || 30,
          destacado: index < 3
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

  // Obtener un transporte por ID
  getTransporte(id: number): Observable<Transporte> {
    return this.http.get<any[]>(`${this.apiUrl}/rutas`).pipe(
      map(rutas => {
        const ruta = rutas.find(r => r.id === id);
        if (ruta) {
          return {
            id: ruta.id,
            nombre: ruta.nombre,
            tipo: ruta.tipo,
            fecha: ruta.fecha,
            origen: ruta.origen,
            destino: ruta.destino,
            precio: ruta.precio,
            empresa: ruta.empresa,
            asientosMax: ruta.asientosMax || 40,
            asientosDisponibles: ruta.asientosDisponibles || 30
          };
        }
        return {
          id: id,
          nombre: 'No encontrado',
          tipo: 'N/A',
          fecha: '',
          origen: 'N/A',
          destino: 'N/A',
          precio: 0
        };
      }),
      catchError(error => {
        console.error('Error al obtener transporte:', error);
        return of({
          id: id,
          nombre: 'Error',
          tipo: 'N/A',
          fecha: '',
          origen: 'N/A',
          destino: 'N/A',
          precio: 0
        });
      })
    );
  }

  // Datos de demostración (fallback)
  getDatosDemo(): Transporte[] {
    return [
      { 
        id: 1, 
        nombre: 'Bus Ejecutivo QUITO-GUAYAQUIL', 
        tipo: '🚌 Bus', 
        fecha: '2026-01-30', 
        origen: 'Quito', 
        destino: 'Guayaquil', 
        precio: 35, 
        asientosMax: 40, 
        asientosDisponibles: 28, 
        destacado: true,
        empresa: 'Transportes Ejecutivos'
      },
      { 
        id: 2, 
        nombre: 'Camioneta 4x4 GYE-QUITO', 
        tipo: '🚛 Camioneta', 
        fecha: '2026-01-31', 
        origen: 'Guayaquil', 
        destino: 'Quito', 
        precio: 65, 
        asientosMax: 5, 
        asientosDisponibles: 3, 
        destacado: true,
        empresa: '4x4 Express'
      },
      { 
        id: 3, 
        nombre: 'Furgoneta Nocturna GYE-QUITO', 
        tipo: '🚐 Furgoneta', 
        fecha: '2026-01-29', 
        origen: 'Guayaquil', 
        destino: 'Quito', 
        precio: 28, 
        asientosMax: 12, 
        asientosDisponibles: 8, 
        destacado: true,
        empresa: 'Viajes Nocturnos'
      },
      { 
        id: 4, 
        nombre: 'Auto Premium QUITO-GYE', 
        tipo: '🚗 Auto', 
        fecha: '2026-02-01', 
        origen: 'Quito', 
        destino: 'Guayaquil', 
        precio: 95, 
        asientosMax: 4, 
        asientosDisponibles: 2, 
        destacado: false,
        empresa: 'Premium Cars'
      },
      { 
        id: 5, 
        nombre: 'Bus Turístico QUITO-GUAYAQUIL', 
        tipo: '🚌 Bus', 
        fecha: '2026-02-02', 
        origen: 'Quito', 
        destino: 'Guayaquil', 
        precio: 42, 
        asientosMax: 45, 
        asientosDisponibles: 33, 
        destacado: false,
        empresa: 'Turismo Ecuador'
      },
      { 
        id: 6, 
        nombre: 'Camioneta Familiar GYE-CUENCA', 
        tipo: '🚛 Camioneta', 
        fecha: '2026-01-30', 
        origen: 'Guayaquil', 
        destino: 'Cuenca', 
        precio: 55, 
        asientosMax: 7, 
        asientosDisponibles: 5, 
        destacado: false,
        empresa: 'Viajes Familiares'
      }
    ];
  }

  // Métodos auxiliares para filtros
  getOrigenesUnicos(transportes: Transporte[]): string[] {
    return [...new Set(transportes.map(t => t.origen))].sort();
  }

  getDestinosUnicos(transportes: Transporte[]): string[] {
    return [...new Set(transportes.map(t => t.destino))].sort();
  }

  getTiposUnicos(transportes: Transporte[]): string[] {
    return [...new Set(transportes.map(t => t.tipo))].sort();
  }
}