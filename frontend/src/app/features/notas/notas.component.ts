import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Nota } from '../../core/models/nota.models';
import { NotasService } from '../../core/services/notas.service';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {

  // Inyectamos dependencias para conectar con el servicio
  private notasService = inject(NotasService);

  // Variables para las vistas
  get listaNotas(): Nota[] {
    return this.notasService.obtenerNotas();
  }

  textoInput: string = '';
  idNotaEnEdicion: number | null = null;

  ngOnInit() {
  }

  // Lógica de negocio y acciones de las vistas
  guardar() {
    if (this.textoInput.trim() === '') return;

    if (this.idNotaEnEdicion) {
      // Si no hay id es get(ACTUALIZAR)
      this.notasService.actualizarNota(this.idNotaEnEdicion, this.textoInput);
      console.log("Componente: Solicitando Actualización (PUT)");
    } else {
      // Si no hay id es post(CREAR)
      this.notasService.crearNota(this.textoInput);
      console.log("Componente: Solicitando Creación (POST)");
    }

    // Limpiar formulario
    this.cancelarEdicion();
  }

  borrar(id: number) {
    if(confirm('¿Borrar nota?')) {
      this.notasService.eliminarNota(id); // Llamamos al servicio (DELETE)
    }
  }

  // Auxiliares de UI y UX
  editar(nota: Nota) {
    this.textoInput = nota.text;
    this.idNotaEnEdicion = nota.id;
  }

  cancelarEdicion() {
    this.textoInput = '';
    this.idNotaEnEdicion = null;
  }
}