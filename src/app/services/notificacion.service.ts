import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getNotificaciones(usuarioId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/notificaciones/usuario/${usuarioId}`);
  }

  // Nuevo método para crear notificaciones (usado en el tablero)
  crearNotificacion(mensaje: string, tipo: 'info' | 'alerta' | 'exito', usuarioId: number) {
    return this.http.post(`${this.apiUrl}/notificaciones`, {
      mensaje,
      tipo,
      usuario_id: usuarioId
    });
  }

  marcarComoLeida(id: number) {
    return this.http.put(`${this.apiUrl}/notificaciones/${id}/leida`, {});
  }
}