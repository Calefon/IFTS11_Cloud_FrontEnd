import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterfazCreacionComponent } from './interfaz-creacion/interfaz-creacion.component';
import { OidcSecurityService } from 'angular-auth-oidc-client'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InterfazCreacionComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'encuestasFrontTest';
  isAuthenticated = false;
  debugMessages: string[] = []; // Para mostrar logs en pantalla

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.addDebugMessage('Constructor iniciado');
  }

  ngOnInit() {
    this.addDebugMessage('ngOnInit() - Iniciando checkAuth()');
    
    this.oidcSecurityService.checkAuth().subscribe({
      next: ({ isAuthenticated, userData, accessToken }) => {
        this.addDebugMessage(`checkAuth() response - Autenticado: ${isAuthenticated}`);
        console.log('Datos del usuario:', userData);
        console.log('Token de acceso:', accessToken);
        this.isAuthenticated = isAuthenticated;
      },
      error: (err) => {
        this.addDebugMessage(`ERROR en checkAuth(): ${err.message}`);
        console.error('Error completo:', err);
      },
      complete: () => this.addDebugMessage('checkAuth() completado')
    });

    // Debug adicional de configuración
    this.oidcSecurityService.getConfiguration().subscribe(config => {
      this.addDebugMessage('Configuración OIDC cargada');
      console.log('Configuración completa:', config);
    });
  }

login() {
  window.location.href = 'https://us-east-2bwy0sbhz9.auth.us-east-2.amazoncognito.com/login?' +
    'client_id=3oq3snl619jn96q3cm57vqqcd2&' +
    'response_type=code&' +
    'scope=email+openid+phone&' +
    'redirect_uri=' + encodeURIComponent('https://d84l1y8p4kdic.cloudfront.net');
}

  logout() {
    this.oidcSecurityService.logoff().subscribe({
      next: () => {
        this.addDebugMessage('Sesión cerrada correctamente');
        this.isAuthenticated = false;
      },
      error: (err) => this.addDebugMessage(`ERROR al cerrar sesión: ${err}`)
    });
  }

  private addDebugMessage(message: string) {
    this.debugMessages.push(message);
    console.log(message);
  }
}