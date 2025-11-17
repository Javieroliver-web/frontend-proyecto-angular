import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment.development';

export interface Proyecto {
  id: number;
  nombre: string;
  estado: string;
  descripcion?: string;
  icono?: string;
  fecha_creacion?: Date | string;
  fecha_actualizacion?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/proyectos`;

  constructor(private http: HttpClient) { }

  // Método para obtener todos los proyectos
  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  // Método para obtener proyectos recientes
  getProyectosRecientes(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.apiUrl}`);
  }

  // Método para obtener un proyecto por su ID
  getProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  // Método para eliminar un proyecto
  eliminarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}