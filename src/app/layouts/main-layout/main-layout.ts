// src/app/layouts/main-layout/main-layout.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent implements OnInit {
  currentUser: Usuario | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    if (confirm('¿Cerrar sesión?')) {
      this.authService.logout();
    }
  }

  getInitials(): string {
    if (!this.currentUser) return '?';
    const nombre = this.currentUser.nombre?.charAt(0) || '';
    const apellido = this.currentUser.apellido?.charAt(0) || '';
    return (nombre + apellido).toUpperCase();
  }
}