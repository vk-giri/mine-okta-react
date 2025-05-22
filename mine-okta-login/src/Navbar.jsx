import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';
import logo from './logo.svg';

const Navbar = ({ setCorsErrorModalOpen }) => {
  const location = useLocation();
  const { authState, oktaAuth } = useOktaAuth();

  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err) => err.name === 'AuthApiError' && !err.errorCode && err.xhr.message === 'Failed to fetch';

  const login = async () => {
    oktaAuth.signInWithRedirect();
  };

  const logout = async () => {
    const basename = window.location.origin + '/';
    
    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: basename });
    } catch (err) {
      if (isCorsError(err)) {
        setCorsErrorModalOpen(true);
      } else {
        throw err;
      }
    }
  };

  if (!authState) {
    return null;
  }

  return (
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>
            <Image size='mini' src={logo} />
            &nbsp;
            <Link to='/'>Okta-React Sample Project</Link>
          </Menu.Item>
          {authState.isAuthenticated && (
            <Menu.Item id='profile-button'>
              <Icon name='user' />
              <Link to='/protected/profile'>Profile</Link>
            </Menu.Item>
          )}
          {authState.isAuthenticated && (
            <Menu.Item id='messages-button'>
              <Icon name='mail' />
              <Link to='/protected/messages'>Messages</Link>
            </Menu.Item>
          )}
          {authState.isAuthenticated && (
            <Menu.Item id='logout-button' onClick={logout}>
              <Icon name='close' />
              Logout
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
