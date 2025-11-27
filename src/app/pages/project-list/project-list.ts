import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private notifService = inject(NotificacionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  proyectos: any[] = [];
  modalOpen = false;
  currentUser: any = null;

  // Modelo para nuevo proyecto
  newProject = {
    nombre: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0], // Hoy
    fecha_fin: '',
    estado: 'Activo',
    usuario_id: 0
  };

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u?.id) {
        this.newProject.usuario_id = u.id;
        this.cargarProyectos();
      }
    });
  }

  cargarProyectos() {
    this.projectService.getProyectos().subscribe(data => this.proyectos = data);
  }

  abrirModal() {
    this.modalOpen = true;
  }

  cerrarModal() {
    this.modalOpen = false;
    this.newProject.nombre = '';
    this.newProject.descripcion = '';
  }

  crearProyecto() {
    this.projectService.crearProyecto(this.newProject).subscribe({
      next: (res) => {
        this.notifService.crearNotificacion(`Has creado el proyecto: ${res.nombre}`, 'exito', this.currentUser.id).subscribe();
        this.cargarProyectos();
        this.cerrarModal();
      },
      error: () => alert('Error al crear proyecto')
    });
  }

  eliminarProyecto(event: Event, id: number) {
    event.stopPropagation(); // Evitar navegar al board
    if (confirm('¿Eliminar proyecto?')) {
      this.projectService.eliminarProyecto(id).subscribe(() => {
        this.notifService.crearNotificacion('Proyecto eliminado', 'alerta', this.currentUser.id).subscribe();
        this.cargarProyectos();
      });
    }
  }

  irABoard(id: number) {
    this.router.navigate(['/board'], { queryParams: { id } });
  }
}