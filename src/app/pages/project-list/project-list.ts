// src/app/pages/project-list/project-list.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectService, Proyecto } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectosRecientes: Proyecto[] = [];
  isLoading = true;
  isLoadingRecientes = true;
  errorMessage = '';

  // Mapeo de iconos por ID o nombre de proyecto (fallback si no viene del backend)
  iconMap: { [key: number]: string } = {
    1: '📦',
    2: '🚀',
    3: '📈'
  };

  constructor(private proyectoService: ProjectService) {}

  ngOnInit(): void {
    this.cargarProyectos();
    this.cargarProyectosRecientes();
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

  cargarProyectosRecientes(): void {
    this.isLoadingRecientes = true;
    this.proyectoService.getProyectosRecientes().subscribe({
      next: (proyectos: Proyecto[]) => {
        this.proyectosRecientes = proyectos;
        this.isLoadingRecientes = false;
      },
      error: (error: any) => {
        console.error('Error al cargar proyectos recientes:', error);
        // Si falla, intentamos usar los proyectos normales como fallback
        this.proyectosRecientes = [];
        this.isLoadingRecientes = false;
      }
    });
  }

  getIcono(proyecto: Proyecto): string {
    return proyecto.icono || this.iconMap[proyecto.id] || '📁';
  }

  getEstadoClass(estado: string | null | undefined): string {
    // 1. Si 'estado' es nulo o indefinido, devuelve 'estado-default' inmediatamente.
    if (!estado) {
      return 'estado-default';
    }
  
    // 2. Si 'estado' SÍ existe, hace el resto del código.
    const estadoMap: { [key: string]: string } = {
      'activo': 'estado-activo',
      'completado': 'estado-completado',
      'pausado': 'estado-pausado',
      'planificado': 'estado-planificado'
    };
    
    // Ahora esta línea es segura porque sabemos que 'estado' no es nulo.
    return estadoMap[estado.toLowerCase()] || 'estado-default';
  }
}