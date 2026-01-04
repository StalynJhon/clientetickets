import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventosService } from '../eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  peliculas: any[] = [];
  todasLasPeliculas: any[] = [];
  form!: FormGroup;
  terminoBusqueda: string = '';

  // 👇 controla el modal de compra
  mostrarFormulario = false;
  eventoSeleccionado: any;

  constructor(
    private eventosService: EventosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nameEvent: [{value: '', disabled: true}],
      descriptionEvent: [{value: '', disabled: true}],
      microserviceEventId: [{value: '', disabled: true}],
      venue: [{value: '', disabled: true}],
      dateTimeEvent: [{value: '', disabled: true}],
      capacity: [{value: 0, disabled: true}],
      imageUrl: [{value: '', disabled: true}]
    });

    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.eventosService.getEventos().subscribe({
      next: (res: any[]) => {
        this.peliculas = res.filter(e => e.eventType === 'cinema');
        this.todasLasPeliculas = [...this.peliculas];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las películas', 'error');
      }
    });
  }

  buscarPeliculas(event: any) {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (!termino) {
      this.peliculas = [...this.todasLasPeliculas];
      return;
    }
    this.peliculas = this.todasLasPeliculas.filter(pelicula =>
      pelicula.nameEvent.toLowerCase().includes(termino)
    );
  }

  // Abrir modal de compra
  comprarEvento(evento: any) {
    this.eventoSeleccionado = {
      ...evento,
      idUsuario: 1 // Usuario fijo
    };

    this.form.patchValue(this.eventoSeleccionado);
    this.mostrarFormulario = true;
  }

  // Guardar compra (simula creación de registro de compra)
  guardarCompra() {
    // Aquí podrías enviar la info al backend, por ejemplo:
    // this.eventosService.comprarEvento(this.eventoSeleccionado).subscribe(...)

    Swal.fire('Compra exitosa', `Has comprado el evento: ${this.eventoSeleccionado.nameEvent}`, 'success');
    this.mostrarFormulario = false;
    this.eventoSeleccionado = null;
    this.form.reset();
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.eventoSeleccionado = null;
    this.form.reset();
  }
}
