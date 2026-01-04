import { Injectable } from "@angular/core";
import { Nota } from "../models/nota.models";

@Injectable({
  providedIn: 'root'
})

export class NotasService {
  private notas: Nota[] = [
    { id: 1, text: 'Primera nota' },
  ];

  constructor() {}

  //Get - obtener notas
  obtenerNotas(): Nota[] {
    return this.notas;
  }

  // Post - Crear nota
  crearNota(text: string): void {
    const nuevaNota: Nota = {
      id: Date.now(),
      text: text
    };
    this.notas.push(nuevaNota);
  }

  //Put - actualizar nota
  actualizarNota(id: number, nuevoTexto: string): void {
    const actualizarNota = this.notas.find(n => n.id === id);
    if (actualizarNota) {
      actualizarNota.text = nuevoTexto;
    }
  }

  //Delete - eliminar nota
  eliminarNota(id: number): void {
    this.notas = this.notas.filter(n => n.id !== id);
  }
}