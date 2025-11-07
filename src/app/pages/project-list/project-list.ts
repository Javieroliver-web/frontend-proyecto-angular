import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <--- 1. IMPORTA RouterLink
import { CommonModule } from '@angular/common'; // <--- 2. IMPORTA CommonModule (para *ngIf, *ngFor)

@Component({
  selector: 'app-project-list',
  standalone: true, // <--- 3. ASEGÚRATE de que es 'standalone'
  imports: [
    RouterLink,    // <--- 4. AÑADE RouterLink aquí
    CommonModule   // <--- 5. AÑADE CommonModule aquí
  ],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent {
  // Aquí va la lógica de tu componente
}