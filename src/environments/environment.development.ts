export const environment = {
    COGNITO_CONFIG: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_aViEenrUD',
        redirectUrl: 'http://localhost:4200',
        clientId: '3f5ik94ron6j3lsj1hg5t7504b',
        scope: 'phone openid email',
        responseType: 'code',
        postLogoutRedirectUri: 'http://localhost:4200'
    },
    INQUIRO_API_LINK: 'https://api.inquiro.site/encuestas'
};
