import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';

import ErrorReporter from './ErrorReporter';

const MyCustomLoginCallback = ({ homePath, loadingElement }) => {
  const [callbackError, setCallbackError] = useState(null);
  const { oktaAuth } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check window.location to verify if the app is in OAuth callback state or not.
    // This function is synchronous and returns true or false.
    if (oktaAuth.isLoginRedirect()) {
      // store redirectUri, it's cleared after `handleLoginRedirect` call
      const redirectUri = oktaAuth.getOriginalUri();

      oktaAuth
        .handleRedirect() // this method exchanges authorization code for tokens
        .then(() => {
          if (!redirectUri) {
            // manual redirect when redirectUri is not set
            // otherwise allow default behavior
            navigate(homePath, { replace: true });
          }
        })
        .catch((e) => {
          setCallbackError(e);
          // console.error(e);
        });
    } else {
      // we landed on root path, but do not have login callback params in url query string
      navigate(homePath, { replace: true });
    }
  }, [oktaAuth, navigate, homePath]);

  // add support for auth state error
  // const displayError = callbackError || authState?.error

  const displayError = callbackError;

  if (displayError) {
    return <ErrorReporter error={displayError} />;
  }

  return loadingElement;
};

export default MyCustomLoginCallback;
