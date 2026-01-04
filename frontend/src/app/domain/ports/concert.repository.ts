import { Observable } from 'rxjs';

export interface Concierto {
  id: number;
  nombre: string;
  fecha: string;
}

export abstract class ConcertRepository {
  abstract getConciertos(): Observable<Concierto[]>;
}
