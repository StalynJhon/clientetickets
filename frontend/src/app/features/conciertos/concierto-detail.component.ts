import { Component, OnInit } from '@angular/core';           // IMPORTS BÁSICOS Angular
import { ActivatedRoute, Router } from '@angular/router';    // ROUTING - Params y navegación
import { CommonModule } from '@angular/common';              // DIRECTIVAS - *ngIf, *ngFor
import { FormsModule } from '@angular/forms';                // FORMULARIOS - ngModel

// INTERFACE CONCIERTO - Tipo de datos del evento
interface Concierto {
  id: number;
  nameConcert: string;     // Nombre del concierto
  nameArtist: string;      // Artista principal
  lugar: string;           // Estadio/venue
  fecha: string;           // Fecha y hora
  descripcion: string;     // Detalles del evento
  coordenadas: { lat: number; lng: number };  // Google Maps
}

// INTERFACE ZONA - Tipos de entrada (VIP, General, etc.)
interface Zona {
  nombre: string;          // "VIP", "General"
  precio: number;          // Precio por asiento
  asientos: number;        // Total asientos disponibles
  color: string;           // Color botón CSS
}

// INTERFACE ASIENTO - Cada asiento individual
interface Asiento {
  id: number;              // ID único (1,2,3...)
  disponible: boolean;     // true = libre, false = ocupado
  seleccionado: boolean;   // true = usuario clickeó
  zona: string;            // "VIP", "General"
}

@Component({
  selector: 'app-concierto-detail',     // SELECTOR - <app-concierto-detail>
  standalone: true,                     // STANDALONE - No necesita módulo
  imports: [CommonModule, FormsModule], // Módulos necesarios
  templateUrl: './concierto-detail.component.html',
  styleUrls: ['./concierto-detail.component.css']
})
export class ConciertoDetailComponent implements OnInit {   // OnInit = lifecycle hook

  // DATOS CONCIERTO - Datos mock (en real: API)
  concierto: Concierto = {
    id: 1,
    nameConcert: 'Bad Bunny - Un Verano Sin Ti Tour',
    nameArtist: 'Bad Bunny',
    lugar: 'Estadio Monumental, Guayaquil',
    fecha: 'Sábado 15 Febrero 2026 - 20:00',
    descripcion: 'El rey del reggaetón regresa a Guayaquil...',
    coordenadas: { lat: -2.1777, lng: -79.8894 }
  };

  // ZONAS DISPONIBLES - Array de zonas con precios
  zonas: Zona[] = [
    { nombre: 'VIP', precio: 150, asientos: 10, color: '#ffc107' },       // Dorado
    { nombre: 'Preferencia', precio: 95, asientos: 20, color: '#007bff' }, // Azul
    { nombre: 'General', precio: 75, asientos: 30, color: '#28a745' },     // Verde
    { nombre: 'Tribuna', precio: 55, asientos: 20, color: '#17a2b8' }      // Cyan
  ];

  // ESTADO APLICACIÓN
  asientos: Asiento[] = [];              // Todos los asientos generados
  zonaSeleccionada = 'General';          // Zona activa (default)
  seleccionados: number[] = [];          // IDs asientos clickeados
  mostrarAsientos = false;               // Toggle mostrar/ocultar asientos
  nombre = '';                           // Formulario compra
  email = '';
  telefono = '';

  // CONSTRUCTOR - Inyección dependencias
  constructor(private route: ActivatedRoute, private router: Router) {}

  // LIFECYCLE - Se ejecuta al cargar componente
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || 1);  // URL param /conciertos/1
    this.generarAsientos();  // Generar asientos al iniciar
  }

  // GENERAR ASIENTOS - Crea array asientos por zona
  generarAsientos() {
    this.asientos = [];
    let id = 1;  // Contador global asientos
    this.zonas.forEach(zona => {  // forEach sobre zonas
      for (let i = 0; i < zona.asientos; i++) {  // Repetir por asientos zona
        this.asientos.push({                    // push() agrega al array
          id: id++,                            // ID autoincremental
          disponible: Math.random() > 0.2,     // 80% disponibles aleatorio
          seleccionado: false,
          zona: zona.nombre
        });
      }
    });
  }

  // SELECCIONAR ZONA - Cambia zona activa
  seleccionarZona(zona: string) {
    this.zonaSeleccionada = zona;  // Actualiza estado reactivo
  }

  // TOGGLE ASIENTO - Click asiento (solo zona seleccionada)
  toggleAsiento(asiento: Asiento) {
    // GUARD CLAUSE - Sale temprano si inválido
    if (!asiento.disponible || asiento.zona !== this.zonaSeleccionada) return;
    
    asiento.seleccionado = !asiento.seleccionado;  // Toggle booleano
    
    if (asiento.seleccionado) {
      this.seleccionados.push(asiento.id);         // Agrega ID
    } else {
      // FILTER - Elimina ID específico
      this.seleccionados = this.seleccionados.filter(id => id !== asiento.id);
    }
  }

  // CLASIFICAR ASIENTO - Devuelve clase CSS dinámica
  getClaseAsiento(asiento: Asiento): string {
    if (!asiento.disponible) return 'asiento ocupado';           // ❌ Rojo
    if (asiento.zona !== this.zonaSeleccionada) return 'asiento otro';  // ⚪ Gris
    if (asiento.seleccionado) return 'asiento seleccionado';     // ✅ Verde
    return 'asiento disponible';                                 // 🟢 Verde claro
  }

  // GETTER TOTAL - Calcula precio dinámico (Reactivo)
  get total(): number {
    const zona = this.zonas.find(z => z.nombre === this.zonaSeleccionada);  // find()
    return this.seleccionados.length * (zona?.precio || 0);      // Optional chaining ?
  }

  // VALIDAR COMPRA - Reglas formulario
  puedeComprar(): boolean {
    return this.seleccionados.length > 0 &&           // Al menos 1 asiento
           this.nombre.trim().length > 0 &&           // Nombre requerido
           this.email.trim().length > 0 &&             // Email requerido
           this.telefono.trim().length > 0;            // Teléfono requerido
  }

  // PROCESAR COMPRA - Lógica final
  comprar() {
    if (!this.puedeComprar()) {                          // Validación
      alert('⚠️ Completa todos los campos...');
      return;
    }
    
    const zona = this.zonas.find(z => z.nombre === this.zonaSeleccionada);
    alert(`🎉 ¡COMPRA EXITOSA!\n\n` +                    // Template literal
          `🎤 ${this.concierto.nameConcert}\n` +
          `👤 ${this.nombre}\n` +
          `📧 ${this.email}\n` +
          `📱 ${this.telefono}\n` +
          `🎫 ${this.seleccionados.length} asientos ${this.zonaSeleccionada}\n` +
          `💰 Total: $${this.total}\n\n` +
          `¡Gracias por tu compra!`);
    
    this.router.navigate(['/conciertos']);               // Redirecciona lista
  }

  // NAVEGAR ATRÁS - Botón volver
  volver() {
    this.router.navigate(['/conciertos']);               // Ruta padre
  }
}
