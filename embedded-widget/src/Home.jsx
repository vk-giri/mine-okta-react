import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

import { useHref, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
  const navigate = useNavigate();
  const relativeHref = useHref('/');

  const { authState, oktaAuth } = useOktaAuth();

  // authstate -> id, access, refresh tokens and isAuthenticated

  const loginHandler = async () => {
    navigate('/login');
  };

  const logoutHandler = async () => {
    const basename = window.location.origin + relativeHref;

    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: basename });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (
    <>
      <h1>Embedded Widget</h1>
      <Button variant='primary' onClick={loginHandler}>
        Login
      </Button>
      {authState?.isAuthenticated && (
        <Button variant='primary' onClick={logoutHandler}>
          Logout
        </Button>
      )}
    </>
  );
};

export default Home;
