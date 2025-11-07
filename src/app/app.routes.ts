import { Routes } from '@angular/router';

// Importa tus componentes (asegúrate de que las rutas son correctas)
import { MainLayoutComponent } from './layouts/main-layout/main-layout.js';
import { LoginComponent } from './pages/login/login.js';
import { ProjectListComponent } from './pages/project-list/project-list.js';
import { BoardComponent } from './pages/board/board.js';

// Esto es lo único que debe haber en este archivo
export const routes: Routes = [
  // Ruta de Login (sin layout)
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Rutas principales (CON el layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'recomendados', 
        component: ProjectListComponent 
      },
      { 
        path: 'proyectos/:id',
        component: BoardComponent
      },
      // Redirección
      { 
        path: '', 
        redirectTo: 'recomendados', 
        pathMatch: 'full' 
      }
    ]
  },
  
  // Ruta comodín
  { path: '**', redirectTo: 'recomendados' }
];