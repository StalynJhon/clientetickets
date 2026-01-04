import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Concierto {
  id: number;
  nameConcert: string;
  nameArtist: string;
  city: string;
  ticketPrice: number;
}

@Injectable({ providedIn: 'root' })
export class ConciertosService {
  getConciertos(): Observable<Concierto[]> {
    return of([
      {id: 1, nameConcert: 'Bad Bunny Tour', nameArtist: 'Bad Bunny', city: 'Guayaquil', ticketPrice: 75},
      {id: 2, nameConcert: 'Taylor Swift', nameArtist: 'Taylor Swift', city: 'Quito', ticketPrice: 150}
    ]);
  }

  getConcierto(id: number): Observable<Concierto> {
    return of({
      id: id,
      nameConcert: 'Bad Bunny Tour',
      nameArtist: 'Bad Bunny',
      city: 'Guayaquil',
      ticketPrice: 75
    });
  }
}
