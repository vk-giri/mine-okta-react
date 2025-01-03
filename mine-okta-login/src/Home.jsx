import { useOktaAuth } from '@okta/okta-react';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Button, Header } from 'semantic-ui-react';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const fromOkta = searchParams.get('fromOkta');

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth
        .getUser()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // if coming via chicklet in Okta dashboard
    // check the url and click the login button
    if (fromOkta) {
      console.log('Self clicking the login button');
      setShowLoader(true);
      login();
    }
  }, [authState, oktaAuth, fromOkta]); // Update if authState changes

  const login = async () => {
    oktaAuth.signInWithRedirect({ originalUri: '/' });
    // oktaAuth.token.getWithRedirect({ originalUri: '/', prompt: "login" });
  };

  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <div id='home'>
      <div>
        <Header as='h1'>PKCE Flow w/ Okta Hosted Login Page</Header>

        {showLoader ? (
          <p textAlign='center' margin-top='250px'>
            Trying to self login into the application........
          </p>
        ) : (
          <>
            {authState.isAuthenticated && !userInfo && <div>Loading user information...</div>}

            {authState.isAuthenticated && userInfo && (
              <div>
                <p id='welcome'>
                  Welcome, &nbsp;
                  {userInfo.name}!
                </p>
                <p>
                  You have successfully authenticated against your Okta org, and have been redirected back to this application. You now have
                  an ID token and access token in local storage. Visit the <a href='/profile'>My Profile</a> page to take a look inside the
                  ID token.
                </p>
              </div>
            )}

            {!authState.isAuthenticated && (
              <div>
                <p>If you&lsquo;re viewing this page then you have successfully started this React application.</p>
                <p>
                  <span>This example shows you how to use the </span>
                  <a href='https://github.com/okta/okta-react/tree/master'>Okta React Library</a>
                  <span> to add the </span>
                  <a href='https://developer.okta.com/docs/guides/implement-auth-code-pkce'>PKCE Flow</a>
                  <span> to your application.</span>
                </p>
                <p>
                  When you click the login button below, you will be presented the login page on the Okta Sign-In Widget hosted within the
                  application. After you authenticate, you will be logged in to this application with an ID token and access token. These
                  tokens will be stored in local storage and can be retrieved at a later time.
                </p>
                <Button id='login-button' primary onClick={login}>
                  Login
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Home;
