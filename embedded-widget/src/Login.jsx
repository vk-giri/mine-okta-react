import { useEffect, useRef } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/css/okta-sign-in.min.css';


import config from './config';

const Login = () => {
  const widgetRef = useRef();
  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    // check if div element is not rendered or is not available in DOM
    if (!widgetRef.current) {
      return false;
    }

    const { issuer, clientId, redirectUri, scopes, useClassicEngine } = config.oidc;

    const widget = new OktaSignIn({
      baseUrl: issuer.split('/oauth2')[0],
      clientId,
      redirectUri,
      authParams: {
        issuer,
        scopes,
      },
      useClassicEngine: useClassicEngine,
    });

    widget
      .showSignIn({ el: widgetRef.current })
      // Handle a redirect to the configured redirectUri that happens on the end of login flow, enroll authenticator flow or on an error.
      .then((res) => {
        // console.log(res); // res -> status and tokens
        oktaAuth.handleRedirect(res.tokens);
      })
      .catch((err) => {
        console.log('login error', err);

        throw err;
      });

    return () => {
      // Remove the widget from the DOM entirely.
      widget.remove();
    };
  }, [oktaAuth]);

  return (
    <>
      <div ref={widgetRef} />
    </>
  );
};

export default Login;
