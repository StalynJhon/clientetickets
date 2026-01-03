import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionesPublicasService {

  private API = 'http://localhost:5000/promotions'; // MISMA API DEL ADMIN

  constructor(private http: HttpClient) {}

  obtenerPromociones(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }
}
