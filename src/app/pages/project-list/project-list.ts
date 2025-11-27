// src/app/pages/project-list/project-list.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Proyecto } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  proyectos: Proyecto[] = [];
  proyectosFavoritos: Proyecto[] = [];
  mostrarModal = false;
  isLoading = false;
  isLoadingFavoritos = false;
  errorMessage = '';
  
  nuevoProyecto: any = { 
    nombre: '', 
    descripcion: '', 
    fecha_inicio: '', 
    fecha_fin: '',
    estado: 'Activo'
  };

  // IDs de proyectos favoritos (para verificación rápida)
  private favoritosIds: Set<number> = new Set();

  ngOnInit() {
    this.cargarProyectos();
    this.cargarFavoritos();
  }

  cargarProyectos() {
    this.isLoading = true;
    this.projectService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando proyectos', err);
        this.errorMessage = 'Error al cargar proyectos';
        this.isLoading = false;
      }
    });
  }

  cargarFavoritos() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.isLoadingFavoritos = true;
    this.projectService.getProyectosFavoritos(usuario.id).subscribe({
      next: (favoritos) => {
        this.proyectosFavoritos = favoritos;
        // Guardamos los IDs para búsqueda rápida
        this.favoritosIds = new Set(favoritos.map(p => p.id));
        this.isLoadingFavoritos = false;
      },
      error: (err) => {
        console.error('Error cargando favoritos', err);
        this.isLoadingFavoritos = false;
      }
    });
  }

  abrirModal() {
    this.nuevoProyecto = { 
      nombre: '', 
      descripcion: '', 
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      estado: 'Activo'
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarProyecto() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Debes estar autenticado';
      return;
    }

    if (!this.nuevoProyecto.nombre.trim()) {
      this.errorMessage = 'El nombre del proyecto es obligatorio';
      return;
    }

    const proyectoData = {
      ...this.nuevoProyecto,
      usuario_id: user.id
    };

    this.projectService.crearProyecto(proyectoData).subscribe({
      next: () => {
        this.mostrarModal = false;
        this.cargarProyectos();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error creando proyecto', err);
        this.errorMessage = 'Error al crear el proyecto';
      }
    });
  }

  eliminarProyecto(id: number, event: Event) {
    event.stopPropagation();
    
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    this.projectService.eliminarProyecto(id).subscribe({
      next: () => {
        this.cargarProyectos();
        this.cargarFavoritos(); // Por si era favorito
      },
      error: (err) => {
        console.error('Error eliminando proyecto', err);
        this.errorMessage = 'Error al eliminar el proyecto';
      }
    });
  }

  toggleFavorito(proyecto: Proyecto, event: Event) {
    event.stopPropagation(); // Evitar navegación al hacer clic en la estrella
    
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    const esFavorito = this.esFavorito(proyecto);

    // Llamada al servicio (ajusta según tu API)
    this.projectService.toggleFavorito(proyecto.id, usuario.id).subscribe({
      next: () => {
        // Actualizar el estado local
        if (esFavorito) {
          this.favoritosIds.delete(proyecto.id);
          this.proyectosFavoritos = this.proyectosFavoritos.filter(p => p.id !== proyecto.id);
        } else {
          this.favoritosIds.add(proyecto.id);
          this.proyectosFavoritos.push(proyecto);
        }
      },
      error: (err) => {
        console.error('Error toggling favorito', err);
        this.errorMessage = 'Error al actualizar favoritos';
      }
    });
  }

  esFavorito(proyecto: Proyecto): boolean {
    return this.favoritosIds.has(proyecto.id);
  }

  getIcono(proyecto: Proyecto): string {
    // Iconos personalizados según nombre/descripción
    const nombre = proyecto.nombre.toLowerCase();
    
    if (nombre.includes('web') || nombre.includes('frontend')) return '🌐';
    if (nombre.includes('mobile') || nombre.includes('app')) return '📱';
    if (nombre.includes('backend') || nombre.includes('api')) return '⚙️';
    if (nombre.includes('design') || nombre.includes('diseño')) return '🎨';
    if (nombre.includes('marketing')) return '📢';
    if (nombre.includes('data') || nombre.includes('analytics')) return '📊';
    
    return '📂'; // Por defecto
  }

  getEstadoClass(estado: string): string {
    if (!estado) return 'activo';
    
    const estadoLower = estado.toLowerCase();
    
    if (estadoLower.includes('activ')) return 'activo';
    if (estadoLower.includes('complet') || estadoLower.includes('finaliz')) return 'completado';
    if (estadoLower.includes('pausad') || estadoLower.includes('suspend')) return 'pausado';
    if (estadoLower.includes('planif')) return 'planificado';
    
    return 'activo';
  }
}