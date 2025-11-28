// src/app/components/header/header.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  
  currentUser: Usuario | null = null;
  notificationCount = 0; // Placeholder por ahora

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  getInitials(): string {
    if (!this.currentUser?.nombre) return 'U';
    return this.currentUser.nombre.charAt(0).toUpperCase();
  }

  logout() {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
    }
  }
}