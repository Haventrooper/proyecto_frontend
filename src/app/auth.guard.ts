// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verifica la presencia del token o cualquier lógica de autenticación que estés utilizando
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirige a la página de inicio de sesión si no hay un token
      this.router.navigate(['/login']);
      return false;
    }

    // Permite la navegación si hay un token
    return true;
  }
}
