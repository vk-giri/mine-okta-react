import { useState } from 'react';
import { OktaAuth } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import config from './config';
import Login from './Login';
import Home from './Home';

const oktaAuth = new OktaAuth(config.oidc);

function App() {
  const [corsErrorModalOpen, setCorsErrorModalOpen] = useState(false);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = useState(false);

  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login');
  };

  // This is triggered when a SecureRoute is accessed without authentication.
  const customAuthHandler = async () => {
    const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();

    console.log('Previous Auth State ', previousAuthState);

    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      goToLoginPage();
    } else {
      // Ask the user to trigger the login process during token autoRenew process
      setAuthRequiredModalOpen(true);
    }
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
  };

  return (
    <>
      <Security oktaAuth={oktaAuth} onAuthRequired={customAuthHandler} restoreOriginalUri={restoreOriginalUri}>
        <Container style={{ marginTop: '7em' }}>
          <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </Container>
      </Security>
    </>
  );
}

export default App;
