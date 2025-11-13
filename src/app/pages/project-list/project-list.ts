// src/app/pages/project-list/project-list.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectoService, Proyecto } from '../../services/proyecto.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {
  proyectos: Proyecto[] = [];
  isLoading = true;
  errorMessage = '';

  // Mapeo de iconos por ID o nombre de proyecto
  iconMap: { [key: number]: string } = {
    1: '📦',
    2: '🚀',
    3: '📈'
  };

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.isLoading = true;
    this.proyectoService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.errorMessage = 'Error al cargar los proyectos';
        this.isLoading = false;
      }
    });
  }

  getIcono(proyecto: Proyecto): string {
    return this.iconMap[proyecto.id] || '📁';
  }

  getEstadoClass(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'activo': 'estado-activo',
      'completado': 'estado-completado',
      'pausado': 'estado-pausado',
      'planificado': 'estado-planificado'
    };
    return estadoMap[estado.toLowerCase()] || 'estado-default';
  }
}