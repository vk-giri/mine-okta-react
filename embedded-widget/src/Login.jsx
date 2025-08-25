import { useEffect, useRef } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/css/okta-sign-in.min.css';

import config from './config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const widgetRef = useRef();
  const { oktaAuth } = useOktaAuth();

  const navigate = useNavigate();

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
      features:{
        multiOptionalFactorEnroll: true,
        showPasswordToggleOnSignInPage: true
      },
      useClassicEngine: useClassicEngine,
    });

    widget
      .showSignIn({ el: widgetRef.current })
      // Handle a redirect to the configured redirectUri that happens on the end of login flow, enroll authenticator flow or on an error.
      .then((res) => {
        // console.log(res); // res -> status and tokens

        oktaAuth
          .handleRedirect()
          .then(() => {
            oktaAuth.tokenManager.setTokens(res.tokens);
            navigate('/');
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log('login error', err);

        throw err;
      });

    widget.on('afterError', (context, error) => {
      // console.log(error);
    });

    widget.on('afterRender', (context) => {
      // console.log(context);
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
