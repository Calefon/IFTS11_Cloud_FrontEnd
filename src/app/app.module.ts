import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      config: {
        authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_BWy0sBhz9',
        redirectUrl: window.location.origin, 
        clientId: '3oq3snl619jn96q3cm57vqqcd2',
        scope: 'openid email profile',
        responseType: 'code',
        postLogoutRedirectUri: window.location.origin, 
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}