import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private apiUrl = 'http://localhost:5000/configuracion';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener configuración general
  getConfiguracionGeneral() {
    return this.http.get<any>(`${this.apiUrl}/general`);
  }

  // 🔹 Obtener información de la empresa
  getInfoEmpresa() {
    return this.http.get<any>(`${this.apiUrl}/empresa`);
  }

  // 🔹 Obtener textos legales
  getTextosLegales() {
    return this.http.get<any>(`${this.apiUrl}/legal`);
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

  // 🔹 Obtener configuración de negocio
  getConfiguracionNegocio() {
    return this.http.get<any>(`${this.apiUrl}/negocio`);
  }

  // 🔹 Guardar configuración general
  guardarConfiguracionGeneral(data: any) {
    return this.http.post(`${this.apiUrl}/general`, data);
  }

  // 🔹 Guardar textos legales
  guardarTextosLegales(data: any) {
    return this.http.post(`${this.apiUrl}/legal`, data);
  }

  // 🔹 Guardar configuración de negocio
  guardarConfiguracionNegocio(data: any) {
    return this.http.post(`${this.apiUrl}/negocio`, data);
  }
}