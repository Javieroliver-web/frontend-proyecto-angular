import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  stats: any = {
    tareasPendientes: 0,
    proyectosActivos: 0,
    notificacionesNoLeidas: 0,
    ultimosProyectos: [],
    tareasProximas: []
  };
  
  usuario: any = null;
  isLoading = true;

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario) {
      this.cargarDashboard();
    }
  }

  cargarDashboard() {
    this.projectService.getDashboard(this.usuario.id).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Error cargando dashboard', e);
        this.isLoading = false;
      }
    });
  }
}