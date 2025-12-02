// src/app/components/header/header.ts
import { Component, inject, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notifService = inject(NotificacionService);
  private elementRef = inject(ElementRef);
  
  currentUser: Usuario | null = null;
  notificaciones: any[] = [];
  notificationCount = 0;
  dropdownOpen = false;
  
  // Para el toast/popup
  toastNotification: any = null;
  showToast = false;
  
  private pollSubscription?: Subscription;
  private previousNotificationIds: Set<number> = new Set();

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user?.id) {
        this.cargarNotificaciones();
        this.iniciarPolling();
      }
    });
  }

  ngOnDestroy() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  // Cerrar dropdown SOLO al hacer clic FUERA del notification-wrapper
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.notification-wrapper');
    
    // Solo cerrar si el click fue fuera del componente de notificaciones
    if (!clickedInside && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  iniciarPolling() {
    this.pollSubscription = interval(30000).subscribe(() => {
      if (this.currentUser?.id) {
        this.cargarNotificaciones();
      }
    });
  }

  cargarNotificaciones() {
    if (!this.currentUser?.id) return;
    
    this.notifService.getNotificaciones(this.currentUser.id).subscribe({
      next: (data) => {
        this.notificaciones = data;
        this.notificationCount = data.length;
      },
      error: (err) => console.error('Error cargando notificaciones', err)
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.cargarNotificaciones();
    }
  }

  // Eliminar notificación individual
  eliminarNotificacion(notif: any, event: Event) {
    // IMPORTANTE: No prevenir el comportamiento por defecto aquí
    event.stopPropagation(); // Solo evitar que se propague
    
    console.log('🗑️ Eliminando notificación:', notif.id);
    
    this.notifService.eliminarNotificacion(notif.id).subscribe({
      next: () => {
        console.log('✅ Notificación eliminada');
        this.notificaciones = this.notificaciones.filter(n => n.id !== notif.id);
        this.notificationCount = this.notificaciones.length;
        
        if (this.notificaciones.length === 0) {
          this.dropdownOpen = false;
        }
      },
      error: (err) => {
        console.error('❌ Error al eliminar notificación:', err);
        console.error('Detalles:', {
          status: err.status,
          message: err.message,
          url: err.url
        });
        alert(`Error: ${err.status} - ${err.message || 'No se pudo eliminar'}`);
      }
    });
  }

  // Eliminar todas las notificaciones
  eliminarTodas(event: Event) {
    event.stopPropagation();
    
    if (!this.currentUser?.id || this.notificaciones.length === 0) return;
    
    const total = this.notificaciones.length;
    console.log(`🗑️ Eliminando ${total} notificaciones...`);
    
    let eliminadas = 0;
    let errores = 0;
    
    this.notificaciones.forEach((notif) => {
      this.notifService.eliminarNotificacion(notif.id).subscribe({
        next: () => {
          eliminadas++;
          console.log(`✅ Eliminada ${eliminadas}/${total}`);
          
          if (eliminadas + errores === total) {
            this.cargarNotificaciones();
            if (errores === 0) {
              this.dropdownOpen = false;
            }
          }
        },
        error: (err) => {
          errores++;
          console.error(`❌ Error eliminando ${notif.id}:`, err);
          
          if (eliminadas + errores === total) {
            this.cargarNotificaciones();
            alert(`Se eliminaron ${eliminadas} de ${total}. ${errores} fallaron.`);
          }
        }
      });
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