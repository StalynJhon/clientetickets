import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../profile.service';
import Swal from 'sweetalert2';

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

  // 🔹 IMPORTANTE: inicializado para que ngModel NO falle
  usuarioEdit: any = {
    nameUsers: '',
    userName: '',
    emailUser: '',
    phoneUser: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const usuarioId = 1;

    this.cargando = true;

    this.usuarioService.obtenerUsuario(usuarioId).subscribe({
      next: (resp: any) => {
        this.cargando = false;

        if (resp) {
          this.usuario = resp;
        } else {
          this.error = 'No se encontraron datos del usuario';

          Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No se encontraron datos del usuario',
            buttonsStyling: false,
            customClass: {
              popup: 'swal-cyber-popup',
              title: 'swal-cyber-title',
              htmlContainer: 'swal-cyber-text',
              icon: 'swal-cyber-icon',
              confirmButton: 'swal-cyber-confirm'
            }
          });
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Error al conectar con el servidor';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar con el servidor',
          buttonsStyling: false,
          customClass: {
            popup: 'swal-cyber-popup',
            title: 'swal-cyber-title',
            htmlContainer: 'swal-cyber-text',
            icon: 'swal-cyber-icon',
            confirmButton: 'swal-cyber-confirm'
          }
        });
      }
    });
  }

  // 🔹 Abrir modal
  abrirModal(): void {
    this.usuarioEdit = { ...this.usuario };
    this.mostrarModal = true;
  }

  // 🔹 Cerrar modal
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // 🔹 Guardar cambios
  guardarCambios(): void {
    Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Se actualizará tu información personal',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'swal-cyber-popup',
        title: 'swal-cyber-title',
        htmlContainer: 'swal-cyber-text',
        icon: 'swal-cyber-icon',
        confirmButton: 'swal-cyber-confirm',
        cancelButton: 'swal-cyber-cancel'
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.usuarioService
          .actualizarUsuario(this.usuario.idUser, {
            nameUsers: this.usuarioEdit.nameUsers,
            userName: this.usuarioEdit.userName,
            emailUser: this.usuarioEdit.emailUser,
            phoneUser: this.usuarioEdit.phoneUser
          })
          .subscribe({
            next: () => {
              this.usuario = { ...this.usuarioEdit };
              this.mostrarModal = false;

              Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Perfil actualizado correctamente',
                timer: 1800,
                showConfirmButton: false,
                buttonsStyling: false,
                customClass: {
                  popup: 'swal-cyber-popup',
                  title: 'swal-cyber-title',
                  htmlContainer: 'swal-cyber-text',
                  icon: 'swal-cyber-icon'
                }
              });
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la información',
                buttonsStyling: false,
                customClass: {
                  popup: 'swal-cyber-popup',
                  title: 'swal-cyber-title',
                  htmlContainer: 'swal-cyber-text',
                  icon: 'swal-cyber-icon',
                  confirmButton: 'swal-cyber-confirm'
                }
              });
            }
          });
      }
    });
  }
}
