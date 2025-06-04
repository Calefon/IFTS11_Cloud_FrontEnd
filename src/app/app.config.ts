import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),provideAuth({
        config: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_aViEenrUD',
        redirectUrl: 'https://www.inquiro.site',
        clientId: '3f5ik94ron6j3lsj1hg5t7504b',
        scope: 'phone openid email',
        responseType: 'code',
        postLogoutRedirectUri: 'https://www.inquiro.site'
      },
      })]
};

/*SANTI */
/*
{
        authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_BWy0sBhz9',
        clientId: '3oq3snl619jn96q3cm57vqqcd2',
        redirectUrl: 'https://us-east-2bwy0sbhz9.auth.us-east-2.amazoncognito.com/login?' +
    'client_id=3oq3snl619jn96q3cm57vqqcd2&' +
    'response_type=code&' +
    'scope=email+openid+phone&' +
    'redirect_uri=' + encodeURIComponent('https://localhost:4200'), // Usa la misma URL que en tu prueba manual
        responseType: 'code',
        scope: 'email openid phone', // Exactamente los mismos scopes
        postLogoutRedirectUri: 'http://localhost:4200',
        autoUserInfo: false,
        logLevel: 2 // Para ver logs detallados
    }
*/ 
/* {
          authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_BWy0sBhz9',
          redirectUrl: window.location.origin, 
          clientId: '3oq3snl619jn96q3cm57vqqcd2',
          scope: 'openid email profile',
          responseType: 'code',
          postLogoutRedirectUri: window.location.origin, 
        }
           */