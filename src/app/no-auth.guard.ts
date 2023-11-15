// no-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // Si hay un token, redirige al usuario a la página de inicio
      this.router.navigate(['/home']);
      return false;
    }

    // No hay sesión activa, permite la navegación
    return true;
  }
}
