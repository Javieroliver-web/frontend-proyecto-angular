// src/app/pages/project-list/project-list.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectService, Proyecto } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectosFavoritos: Proyecto[] = [];
  isLoading = true;
  isLoadingFavoritos = true;
  errorMessage = '';

  // Mapeo de iconos por ID
  iconMap: { [key: number]: string } = {
    1: '📦',
    2: '🚀',
    3: '📈'
  };

  constructor(
    private proyectoService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarProyectosFavoritos();
  }

  cargarProyectos(): void {
    this.isLoading = true;
    this.proyectoService.getProyectos().subscribe({
      next: (proyectos: Proyecto[]) => {
        this.proyectos = proyectos;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar proyectos:', error);
        this.errorMessage = 'Error al cargar los proyectos';
        this.isLoading = false;
      }
    });
  }

  cargarProyectosFavoritos(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.isLoadingFavoritos = false;
      return;
    }

    this.isLoadingFavoritos = true;
    this.proyectoService.getProyectosFavoritos(usuario.id).subscribe({
      next: (proyectos: Proyecto[]) => {
        this.proyectosFavoritos = proyectos;
        this.isLoadingFavoritos = false;
      },
      error: (error: any) => {
        console.error('Error al cargar proyectos favoritos:', error);
        this.proyectosFavoritos = [];
        this.isLoadingFavoritos = false;
      }
    });
  }

  toggleFavorito(proyecto: Proyecto, event: Event): void {
    event.stopPropagation(); // Evitar navegación al hacer clic en estrella
    
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.proyectoService.toggleFavorito(proyecto.id, usuario.id).subscribe({
      next: () => {
        // Recargar ambas listas
        this.cargarProyectosFavoritos();
        this.cargarProyectos();
      },
      error: (error: any) => {
        console.error('Error al marcar favorito:', error);
      }
    });
  }

  getIcono(proyecto: Proyecto): string {
    return proyecto.icono || this.iconMap[proyecto.id] || '📁';
  }

  getEstadoClass(estado: string | null | undefined): string {
    if (!estado) {
      return 'estado-default';
    }
  
    const estadoMap: { [key: string]: string } = {
      'activo': 'estado-activo',
      'completado': 'estado-completado',
      'pausado': 'estado-pausado',
      'planificado': 'estado-planificado'
    };
    
    return estadoMap[estado.toLowerCase()] || 'estado-default';
  }

  esFavorito(proyecto: Proyecto): boolean {
    return this.proyectosFavoritos.some(p => p.id === proyecto.id);
  }
}