const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '{clientId}';
const ISSUER = import.meta.env.VITE_ISSUER || 'https://{yourOktaDomain}.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = import.meta.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const BASENAME = import.meta.env.BASE_URL || '';
const REDIRECT_URI = `${window.location.origin}${BASENAME}login/callback`;
const USE_CLASSIC_ENGINE = import.meta.env.USE_CLASSIC_ENGINE === 'true' || false;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    useClassicEngine: USE_CLASSIC_ENGINE,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
  app: {
    basename: BASENAME,
  },
};
