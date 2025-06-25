import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'encuestasFrontTest';
  private readonly oidcSecurityService = inject(OidcSecurityService);
  public isAuthenticated = false;
  private debugMessages: string[] = [];
  inquiroLogo: string = '../../public/inquiroLogo.webp';


  ngOnInit() {

    this.addDebugMessage('AWSService - Constructor iniciado');

    this.addDebugMessage('AWSService - Constructor - Iniciando checkAuth()');

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
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe({
      next: () => {
        this.addDebugMessage('Sesión cerrada correctamente');
        this.isAuthenticated = false;
      },
      error: (err:any) => this.addDebugMessage(`ERROR al cerrar sesión: ${err}`)
    });
  }

  getIsAuthenticated() : boolean {
    return this.isAuthenticated;
  }

  private addDebugMessage(message: string) {
    console.log("Debug: "+message)
    this.debugMessages.push(message);
    console.log(message);
  }
}
