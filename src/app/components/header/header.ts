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
  public authService = inject(AuthService);
  currentUser: Usuario | null = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => this.currentUser = user);
  }

  getInitials(): string {
    return this.currentUser?.nombre ? this.currentUser.nombre.charAt(0).toUpperCase() : 'U';
  }

  logout() {
    this.authService.logout();
  }
}