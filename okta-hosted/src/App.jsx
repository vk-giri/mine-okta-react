import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';
import { Container } from 'semantic-ui-react';
import config from './config';
import Home from './Home';

import Messages from './Messages';
import Navbar from './Navbar';
import Profile from './Profile';
import CorsErrorModal from './CorsErrorModal';
import AuthRequiredModal from './AuthRequiredModal';
import RequiredAuth from './SecureRoute';
import Loading from './Loading';
import MyCustomLoginCallback from './MyCustomLoginCallback';
import Test from './Test';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
  const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = React.useState(false);

  const navigate = useNavigate();

  const triggerLogin = async () => {
    await oktaAuth.signInWithRedirect();
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
  };

  const customAuthHandler = async () => {
    const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      await triggerLogin();
    } else {
      // Ask the user to trigger the login process during token autoRenew process
      setAuthRequiredModalOpen(true);
    }
  };

  return (
    <Security oktaAuth={oktaAuth} onAuthRequired={customAuthHandler} restoreOriginalUri={restoreOriginalUri}>
      <Navbar {...{ setCorsErrorModalOpen }} />
      <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
      <AuthRequiredModal {...{ authRequiredModalOpen, setAuthRequiredModalOpen, triggerLogin }} />
      <Container text style={{ marginTop: '7em' }}>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/login/callback' element={<MyCustomLoginCallback homePath='/home' loadingElement={<Loading />} />} />
          <Route path='/' element={<Navigate to='/home' />} />

          <Route path='/protected' element={<RequiredAuth />}>
            <Route path='/protected/messages' element={<Messages />} />
            <Route path='/protected/profile' element={<Profile />} />
          </Route>
        </Routes>
      </Container>
    </Security>
  );
};

export default App;
