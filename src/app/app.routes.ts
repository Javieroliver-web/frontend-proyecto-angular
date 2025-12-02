import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ProjectListComponent } from './pages/project-list/project-list';
import { BoardComponent } from './pages/board/board';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Ruta de login sin protección
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas con authGuard
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'proyectos', component: ProjectListComponent },
      { path: 'board', component: BoardComponent }
    ]
  },
  
  // Cualquier ruta no definida redirige a login
  { path: '**', redirectTo: 'login' }
];