import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-info-empresa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-empresa.component.html',
  styleUrls: ['./info-empresa.component.css']
})
export class InfoEmpresaComponent implements OnInit {

  infoEmpresa: any = null;
  configGeneral: any = null;
  cargando = true;
  error = false;
  
  sections = {
    about: { expanded: true },
    contact: { expanded: true }
  };

  constructor(private configuracionService: ConfiguracionService) {}

  ngOnInit(): void {
    this.cargarConfiguracionGeneral();
  }

  cargarConfiguracionGeneral() {
    this.configuracionService.getConfiguracionGeneral().subscribe({
      next: (data) => {
        this.configGeneral = data;
        this.infoEmpresa = data; // Mantener compatibilidad con el HTML existente
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar configuración general:', err);
        // Si falla la nueva API, intentar con la antigua
        this.cargarInfoEmpresaAntiguo();
      }
    });
  }
  
  cargarInfoEmpresaAntiguo() {
    this.configuracionService.getInfoEmpresa().subscribe({
      next: (data) => {
        this.infoEmpresa = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar información de la empresa:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  toggleSection(section: string): void {
    if (section === 'about') {
      this.sections.about.expanded = !this.sections.about.expanded;
    } else if (section === 'contact') {
      this.sections.contact.expanded = !this.sections.contact.expanded;
    }
  }
}