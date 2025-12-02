// src/app/services/notificacion.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroment/enviroment.development';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'info' | 'alerta' | 'exito';
  leida: boolean;
  fecha: string;
  usuario_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Obtener todas las notificaciones de un usuario
  getNotificaciones(usuarioId: number): Observable<Notificacion[]> {
    const url = `${this.apiUrl}/notificaciones/usuario/${usuarioId}`;
    console.log('GET Notificaciones:', url);
    return this.http.get<Notificacion[]>(url).pipe(
      tap(data => console.log('Notificaciones recibidas:', data))
    );
  }

  // Obtener solo las no leídas (para el badge)
  getNotificacionesNoLeidas(usuarioId: number): Observable<Notificacion[]> {
    const url = `${this.apiUrl}/notificaciones/usuario/${usuarioId}/no-leidas`;
    console.log('GET Notificaciones no leídas:', url);
    return this.http.get<Notificacion[]>(url);
  }

  // Crear nueva notificación
  crearNotificacion(mensaje: string, tipo: 'info' | 'alerta' | 'exito', usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}/notificaciones`;
    console.log('POST Notificación:', url);
    return this.http.post(url, {
      mensaje,
      tipo,
      usuario_id: usuarioId
    });
  }

  // Marcar una notificación como leída
  marcarComoLeida(id: number): Observable<any> {
    const url = `${this.apiUrl}/notificaciones/${id}/leer`;
    console.log('PUT Marcar como leída:', url);
    return this.http.put(url, {});
  }

  // Marcar todas como leídas
  marcarTodasComoLeidas(usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}/notificaciones/usuario/${usuarioId}/leer-todas`;
    console.log('PUT Marcar todas como leídas:', url);
    return this.http.put(url, {});
  }

  // Eliminar notificación individual
  eliminarNotificacion(id: number): Observable<any> {
    const url = `${this.apiUrl}/notificaciones/${id}`;
    console.log('DELETE Notificación:', url);
    return this.http.delete(url).pipe(
      tap(() => console.log(`Notificación ${id} eliminada del servidor`))
    );
  }
}