import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TareaService } from '../../services/tarea.service';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthService } from '../../services/auth.service';

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
  private notifService = inject(NotificacionService);
  private authService = inject(AuthService);

  proyecto: any = {};
  tareas: any[] = [];
  currentUser: any = null;

  // Estados de Modales
  modalEditOpen = false; // Para Crear/Editar
  modalViewOpen = false; // Para Ver detalles
  isEditMode = false;

  // Objeto para formulario y objeto seleccionado
  currentTarea: any = { titulo: '', descripcion: '', estado: 'pendiente', fecha_limite: '' };
  selectedTarea: any = null; // Tarea que se está visualizando

  columnas: any = { pendiente: [], en_progreso: [], completada: [] };

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.route.queryParams.subscribe(p => { 
      if (p['id']) this.cargarTablero(p['id']); 
    });
  }

  cargarTablero(id: number) {
    this.projectService.getTablero(id).subscribe({
      next: (data) => { 
        this.proyecto = data.proyecto; 
        this.tareas = data.tareas; 
        this.organizarTareas(); 
      }
    });
  }

  organizarTareas() {
    if (!this.tareas) return;
    this.columnas.pendiente = this.tareas.filter(t => ['pendiente', 'por hacer'].includes(t.estado.toLowerCase()));
    this.columnas.en_progreso = this.tareas.filter(t => ['en_progreso', 'en curso'].includes(t.estado.toLowerCase()));
    this.columnas.completada = this.tareas.filter(t => ['completada', 'finalizada'].includes(t.estado.toLowerCase()));
  }

  // --- LÓGICA DE MODALES ---

  // 1. Abrir Modal de CREAR (directo al formulario)
  abrirModalCrear(estado: string) {
    this.isEditMode = false;
    this.currentTarea = { 
      titulo: '', 
      descripcion: '', 
      estado: estado, 
      fecha_limite: new Date().toISOString().split('T')[0], // Hoy yyyy-MM-dd
      proyecto_id: this.proyecto.id 
    };
    this.modalEditOpen = true;
  }

  // 2. Abrir Modal de VER (Solo lectura, como en el original)
  abrirModalVer(tarea: any) {
    this.selectedTarea = tarea;
    this.modalViewOpen = true;
  }

  // 3. Desde Ver -> Ir a Editar
  abrirModalEditarDesdeVer() {
    this.modalViewOpen = false; // Cierra el de ver
    this.isEditMode = true;
    
    // Clonamos para no modificar la vista hasta guardar
    // Importante: La fecha viene dd-MM-yyyy del backend, el input date necesita yyyy-MM-dd
    this.currentTarea = { 
      ...this.selectedTarea, 
      fecha_limite: this.apiToInputDate(this.selectedTarea.fecha_limite) 
    };
    this.modalEditOpen = true;
  }

  cerrarModales() {
    this.modalEditOpen = false;
    this.modalViewOpen = false;
    this.selectedTarea = null;
  }

  // --- LÓGICA CRUD ---

  guardarTarea() {
    // Convertir fecha de input (yyyy-MM-dd) a API (dd-MM-yyyy)
    const tareaEnvio = { 
      ...this.currentTarea, 
      fecha_limite: this.inputToApiDate(this.currentTarea.fecha_limite) 
    };

    const obs = this.isEditMode 
      ? this.tareaService.editarTarea(this.currentTarea.id, tareaEnvio) 
      : this.tareaService.crearTarea(tareaEnvio);

    obs.subscribe(() => { 
      const msg = this.isEditMode ? 'Tarea actualizada' : 'Nueva tarea creada';
      this.enviarNotificacion(msg, 'info');
      this.cerrarModales(); 
      this.cargarTablero(this.proyecto.id); 
    });
  }
  
  eliminarTarea(id: number) {
    if(confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.tareaService.eliminarTarea(id).subscribe(() => {
        this.enviarNotificacion('Tarea eliminada', 'alerta');
        this.cerrarModales();
        this.cargarTablero(this.proyecto.id);
      });
    }
  }

  // --- DRAG & DROP ---

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
        
        // Optimista: Actualizar UI antes de respuesta del servidor
        const estadoAnterior = tarea.estado;
        tarea.estado = nuevoEstado;
        
        // Llamada a API
        this.tareaService.cambiarEstado(tarea.id, nuevoEstado).subscribe({
          next: () => {
             const nombreEstado = nuevoEstado === 'completada' ? 'Completada' : 'En Curso';
             const tipo = nuevoEstado === 'completada' ? 'exito' : 'info';
             this.enviarNotificacion(`Tarea movida a: ${nombreEstado}`, tipo);
             this.cargarTablero(this.proyecto.id); // Recargar para asegurar consistencia
          },
          error: () => {
             alert('Error al mover la tarea');
             this.cargarTablero(this.proyecto.id); // Revertir cambios
          }
        });
      }
    }
  }

  // --- UTILIDADES ---

  enviarNotificacion(msg: string, tipo: 'info'|'alerta'|'exito') {
    if(this.currentUser?.id) {
      this.notifService.crearNotificacion(msg, tipo, this.currentUser.id).subscribe();
    }
  }

  // dd-MM-yyyy -> yyyy-MM-dd (Para input type="date")
  apiToInputDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-'); 
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  }

  // yyyy-MM-dd -> dd-MM-yyyy (Para enviar al backend)
  inputToApiDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  }
}