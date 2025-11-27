import { Component, OnInit } from '@angular/core';
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
  proyectos: Proyecto[] = [];
  mostrarModal = false;
  nuevoProyecto: any = { nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '' };

  constructor(private projectService: ProjectService, private authService: AuthService) {}

  ngOnInit() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.projectService.getProyectos().subscribe(p => this.proyectos = p);
  }

  abrirModal() {
    this.nuevoProyecto = { nombre: '', descripcion: '', fecha_inicio: new Date().toISOString().split('T')[0] };
    this.mostrarModal = true;
  }

  guardarProyecto() {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const p = { ...this.nuevoProyecto, usuario_id: user.id, estado: 'Activo' };
    this.projectService.crearProyecto(p).subscribe(() => {
      this.mostrarModal = false;
      this.cargarProyectos();
    });
  }

  eliminarProyecto(id: number, e: Event) {
    e.stopPropagation();
    if(confirm('¿Eliminar?')) this.projectService.eliminarProyecto(id).subscribe(() => this.cargarProyectos());
  }
}