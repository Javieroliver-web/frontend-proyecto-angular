import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../enviroment/enviroment.development';

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: Date | string;
  fecha_fin?: Date | string;
  estado: string;
  usuario_id: number;
  es_favorito?: boolean;
  icono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/proyectos`;
  private baseUrl = environment.apiUrl;

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  getProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  crearProyecto(proyecto: any): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.apiUrl, proyecto);
  }

  eliminarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTablero(proyectoId: number): Observable<{ proyecto: Proyecto; tareas: any[] }> {
    return forkJoin({
      proyecto: this.http.get<Proyecto>(`${this.apiUrl}/${proyectoId}`),
      tareas: this.http.get<any[]>(`${this.baseUrl}/tareas/proyecto/${proyectoId}`)
    });
  }

  getDashboard(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/${usuarioId}/dashboard`);
  }

  getProyectosFavoritos(usuarioId: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseUrl}/tareas/usuario/${usuarioId}/favoritas`); // Ajustado según tu API, si falla usa endpoint específico
  }

  toggleFavorito(proyectoId: number, usuarioId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${proyectoId}/favorito`, { usuario_id: usuarioId });
  }
}