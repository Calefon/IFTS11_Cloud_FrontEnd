export const environment = {
    COGNITO_CONFIG: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_aRl5eh4uh',
        redirectUrl: 'http://localhost:4200/',
        clientId: '7jl1nas9dd8chvba6idon2a856',
        scope: 'phone openid email',
        responseType: 'code',
        postLogoutRedirectUri: 'http://localhost:4200/'
    },
    INQUIRO_API_LINK: 'https://api.inquiro.site'
};
