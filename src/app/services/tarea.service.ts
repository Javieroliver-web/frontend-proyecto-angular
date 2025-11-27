import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/enviroment.development';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  crearTarea(tarea: any) {
    return this.http.post(`${this.apiUrl}/tareas`, tarea);
  }

  editarTarea(id: number, tarea: any) {
    return this.http.put(`${this.apiUrl}/tareas/${id}`, tarea);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.put(`${this.apiUrl}/tareas/${id}`, { estado });
  }

  eliminarTarea(id: number) {
    return this.http.delete(`${this.apiUrl}/tareas/${id}`);
  }
}