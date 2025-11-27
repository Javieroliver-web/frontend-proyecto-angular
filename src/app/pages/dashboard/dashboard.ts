import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: any = null;
  stats: any = {
    tareasPendientes: 0,
    proyectosActivos: 0,
    ultimosProyectos: [],
    tareasProximas: []
  };
  isLoading = true;

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u && u.id) this.cargarDashboard(u.id);
    });
  }

  cargarDashboard(userId: number) {
    this.projectService.getDashboard(userId).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard', err);
        this.isLoading = false;
      }
    });
  }

  irAProyecto(id: number) {
    this.router.navigate(['/board'], { queryParams: { id } });
  }
}