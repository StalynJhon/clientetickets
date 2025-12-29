import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private apiUrl = 'http://localhost:5000/configuracion';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener información de la empresa
  getInfoEmpresa() {
    return this.http.get<any>(`${this.apiUrl}/empresa`);
  }

  // 🔹 Obtener términos y condiciones
  getTerminosCondiciones() {
    return this.http.get<any>(`${this.apiUrl}/terminos`);
  }

  // 🔹 Obtener política de privacidad
  getPoliticaPrivacidad() {
    return this.http.get<any>(`${this.apiUrl}/privacidad`);
  }

  // 🔹 Obtener ayuda / FAQ
  getAyudaFAQ() {
    return this.http.get<any>(`${this.apiUrl}/ayuda`);
  }
}