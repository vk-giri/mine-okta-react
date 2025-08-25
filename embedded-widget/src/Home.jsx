import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

import { useHref, useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import Loading from './Loading';

const Home = () => {
  const navigate = useNavigate();
  const relativeHref = useHref('/');
  const [userInfo, setUserInfo] = useState(null);

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
  }, [authState, oktaAuth]);

  if (!authState) {
    return <Loading />;
  }

  return (
    <>
      <h1>Embedded Widget</h1>

      {!authState.isAuthenticated ? (
        <>
          <p>Please Login to the app</p>
          <Button id='login-button' variant='primary' onClick={loginHandler}>
            Login
          </Button>
        </>
      ) : (
        <Button variant='primary' onClick={logoutHandler}>
          Logout
        </Button>
      )}

      {authState.isAuthenticated && !userInfo && <Loading />}

      {authState.isAuthenticated && userInfo && (
        <>
          <p id='welcome'>
            Welcome, &nbsp;
            {userInfo.name}!
          </p>
          <Table striped bordered hover style={{ maxWidth: '30%' }}>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(userInfo).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default Home;
