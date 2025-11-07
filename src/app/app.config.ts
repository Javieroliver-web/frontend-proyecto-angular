import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes.js';

// 1. Importa el provider de ng2-charts
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 2. Añade el provider aquí
    provideCharts(withDefaultRegisterables())
  ]
};