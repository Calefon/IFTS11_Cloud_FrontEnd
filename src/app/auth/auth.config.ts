import { PassedInitialConfig } from "angular-auth-oidc-client";

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_BWy0sBhz9',
    clientId: '3oq3snl619jn96q3cm57vqqcd2',
    redirectUrl: 'https://d84l1y8p4kdic.cloudfront.net', // Usa la misma URL que en tu prueba manual
    responseType: 'code',
    scope: 'email openid phone', // Exactamente los mismos scopes
    postLogoutRedirectUri: 'https://d84l1y8p4kdic.cloudfront.net',
    autoUserInfo: false,
    logLevel: 2 // Para ver logs detallados
  }
};