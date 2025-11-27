import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TareaService } from '../../services/tarea.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class BoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private tareaService = inject(TareaService);

  proyecto: any = {};
  tareas: any[] = [];
  modalOpen = false;
  isEditMode = false;
  currentTarea: any = { titulo: '', descripcion: '', estado: 'pendiente', fecha_limite: '' };
  columnas: any = { pendiente: [], en_progreso: [], completada: [] };

  ngOnInit() {
    this.route.queryParams.subscribe(p => { if (p['id']) this.cargarTablero(p['id']); });
  }

  cargarTablero(id: number) {
    this.projectService.getTablero(id).subscribe({
      next: (data) => { this.proyecto = data.proyecto; this.tareas = data.tareas; this.organizarTareas(); }
    });
  }

  organizarTareas() {
    if (!this.tareas) return;
    this.columnas.pendiente = this.tareas.filter(t => ['pendiente', 'por hacer'].includes(t.estado.toLowerCase()));
    this.columnas.en_progreso = this.tareas.filter(t => ['en_progreso', 'en curso'].includes(t.estado.toLowerCase()));
    this.columnas.completada = this.tareas.filter(t => ['completada', 'finalizada'].includes(t.estado.toLowerCase()));
  }

  apiToInputDate(dateStr: string): string {
    if (!dateStr) return '';
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) return dateStr;
    const parts = dateStr.split('-'); 
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';
  }

  inputToApiDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  }

  onDragStart(event: DragEvent, tarea: any) {
    event.dataTransfer?.setData('text/plain', JSON.stringify(tarea));
  }
  onDragOver(event: DragEvent) { event.preventDefault(); }
  
  onDrop(event: DragEvent, nuevoEstado: string) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      const tarea = JSON.parse(data);
      if (tarea.estado !== nuevoEstado) {
        tarea.estado = nuevoEstado;
        this.organizarTareas();
        this.tareaService.cambiarEstado(tarea.id, nuevoEstado).subscribe({ error: () => this.cargarTablero(this.proyecto.id) });
      }
    }
  }

  abrirModalCrear(estado: string) {
    this.isEditMode = false;
    this.currentTarea = { titulo: '', descripcion: '', estado: estado, fecha_limite: new Date().toISOString().split('T')[0], proyecto_id: this.proyecto.id };
    this.modalOpen = true;
  }

  abrirModalEditar(tarea: any) {
    this.isEditMode = true;
    this.currentTarea = { ...tarea, fecha_limite: this.apiToInputDate(tarea.fecha_limite) };
    this.modalOpen = true;
  }

  guardarTarea() {
    const tareaEnvio = { ...this.currentTarea, fecha_limite: this.inputToApiDate(this.currentTarea.fecha_limite) };
    const obs = this.isEditMode ? this.tareaService.editarTarea(this.currentTarea.id, tareaEnvio) : this.tareaService.crearTarea(tareaEnvio);
    obs.subscribe(() => { this.modalOpen = false; this.cargarTablero(this.proyecto.id); });
  }
  
  eliminarTarea(id: number) {
    if(confirm('¿Eliminar?')) this.tareaService.eliminarTarea(id).subscribe(() => this.cargarTablero(this.proyecto.id));
  }
}