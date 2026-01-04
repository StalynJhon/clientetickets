import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Concierto {
  id: number;
  nombre: string;
  fecha: string;
}

export abstract class ConcertRepository {
  abstract getConciertos(): Observable<Concierto[]>;
}

@Injectable()
export class ConcertRepositoryImpl extends ConcertRepository {
  constructor(private http: HttpClient) { super(); }

  getConciertos(): Observable<Concierto[]> {
    return this.http.get<Concierto[]>('http://localhost:5000/api/concerts');
  }
}
