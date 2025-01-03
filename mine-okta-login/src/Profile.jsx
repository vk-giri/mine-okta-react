import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Header, Icon } from 'semantic-ui-react';
import { fetchIntrospectData } from '../api/apis';
import Panes from './Panes';

const Profile = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState([]);

  const [accessToken, setAccessToken] = useState({});
  const [idToken, setIdToken] = useState({});
  const [refreshToken, setRefreshToken] = useState({});
  const [introspectData, setIntrospectData] = useState({});

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
      setAccessToken({});
      setRefreshToken({});
      setIdToken({});
    } else {
      oktaAuth
        .getUser()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((err) => {
          console.error(err);
        });

      setAccessToken(authState.accessToken);
      setRefreshToken(authState.refreshToken);
      setIdToken(authState.idToken);
      setLocation(oktaAuth.transactionManager.storageManager.storageManagerOptions.token.storageTypes);
    }
  }, [authState, oktaAuth]); // Update if authState changes

  useEffect(() => {
    const getIntrospectData = async () => {
      try {
        const result = await fetchIntrospectData(refreshToken.refreshToken);
        setIntrospectData(result);
      } catch (error) {
        console.log(error);
      }
    };

    if (accessToken) getIntrospectData();
  }, [refreshToken]);

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '15px' }}>
        <Header as='h1'>
          <Icon name='drivers license' /> My Tokens{' '}
        </Header>
        <p>
          Below is the information from your token which was obtained during the login Flow and is now stored in {location.join(' or ')}.
        </p>
        <p>
          This route is protected with the <code>&lt;SecureRoute&gt;</code> component, which will ensure that this page cannot be accessed
          until you have authenticated.
        </p>
      </div>

      <Panes accessToken={accessToken} idToken={idToken} refreshToken={refreshToken} introspectData={introspectData} userInfo={userInfo} />
    </>
  );
};

export default Profile;
