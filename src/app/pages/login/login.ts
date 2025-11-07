import { Component } from '@angular/core';
import { Router } from '@angular/router'; // <-- 1. Importa el Router

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // 2. Inyéctalo en el constructor
  constructor(private router: Router) { }

  // 3. Úsalo en tu función login()
  login() {
    console.log('Intento de inicio de sesión...');
    
    // (Aquí iría tu lógica de autenticación)
    // Si la autenticación es exitosa:
    
    // 4. Redirige a '/recomendados'
    this.router.navigate(['/recomendados']);
  }
}