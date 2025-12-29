import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../profile.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  usuario: any = null;
  cargando: boolean = true;
  error: string | null = null;

  // 🔹 Modal
  mostrarModal: boolean = false;
  usuarioEdit: any = {};

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  const usuarioId = 1;

  this.usuarioService.obtenerUsuario(usuarioId).subscribe({
    next: (resp: any) => {
      this.cargando = false;

      if (resp) {
        this.usuario = {
          ...resp,
          // 🔥 normalizamos el nombre
          nameUser: resp.nameUser ?? resp.nameUsers ?? ''
        };
      } else {
        this.error = 'No se encontraron datos del usuario';
      }
    },
    error: () => {
      this.cargando = false;
      this.error = 'Error al conectar con el servidor';
    }
  });
}

  // 🔹 Abrir modal
  abrirModal() {
    this.usuarioEdit = { ...this.usuario }; // clonamos datos
    this.mostrarModal = true;
  }

  // 🔹 Cerrar modal
  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCambios() {
    this.usuarioService.actualizarUsuario(this.usuario.idUser, this.usuarioEdit)
      .subscribe({
        next: () => {
          this.usuario = {
            ...this.usuario,
            ...this.usuarioEdit,
            nameUser: this.usuarioEdit.nameUser || this.usuario.nameUser
          };
          this.mostrarModal = false;
        },
        error: () => {
          alert('Error al actualizar datos');
        }
      });
  }
}