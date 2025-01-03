import { Popup, Icon, Table, Tab, TabPane } from 'semantic-ui-react';
import { jwtDecode } from 'jwt-decode';

const Panes = ({ accessToken, idToken, introspectData, refreshToken, userInfo }) => {
  const decodedAccessToken = jwtDecode(accessToken.accessToken);
  const decodedIdToken = jwtDecode(idToken.idToken);

  // console.log(idToken);
  // console.log(accessToken);
  // console.log(refreshToken);

  const panes = [
    {
      menuItem: 'Access Token',
      render: () => (
        <TabPane>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <h3>My Access Token </h3>
            <Popup
              content='Copy your Access Token'
              trigger={
                <Icon
                  name='clipboard outline'
                  color='green'
                  size='large'
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(accessToken.accessToken);
                  }}
                />
              }
            />
          </div>
          <Table>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(decodedAccessToken).map((claimEntry) => {
                const claimName = claimEntry[0];
                const claimValue = claimEntry[1];
                const claimId = `claim-${claimName}`;
                return (
                  <tr key={claimName}>
                    <td>{claimName}</td>
                    {['iat', 'exp'].includes(claimName) ? (
                      <td id={claimId}>{new Date(claimValue * 1000).toString()}</td>
                    ) : (
                      <td id={claimId}>{claimValue.toString()}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TabPane>
      ),
    },
    {
      menuItem: 'ID Token',
      render: () => (
        <TabPane>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <h3>My User Profile (ID Token Claims) </h3>
            <Popup
              content='Copy your ID Token'
              trigger={
                <Icon
                  name='clipboard outline'
                  color='green'
                  size='large'
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(idToken.idToken);
                  }}
                />
              }
            />
          </div>
          <Table>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries({ ...userInfo, ...decodedIdToken }).map((claimEntry) => {
                const claimName = claimEntry[0];
                const claimValue = claimEntry[1];
                const claimId = `claim-${claimName}`;
                return (
                  <tr key={claimName}>
                    <td>{claimName}</td>
                    <td id={claimId}>
                      {['iat', 'exp', 'auth_time'].includes(claimName) ? (
                        new Date(claimValue * 1000).toString()
                      ) : claimName !== 'headers' ? (
                        claimValue.toString()
                      ) : (
                        <pre>{JSON.stringify(claimValue, null, 2)}</pre>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TabPane>
      ),
    },
    {
      menuItem: 'Refresh Token',
      render: () => (
        <TabPane>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <h3>Refresh Token Details </h3>
            <Popup
              content='Copy your Refresh Token'
              trigger={
                <Icon
                  name='clipboard outline'
                  color='green'
                  size='large'
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(refreshToken.refreshToken);
                  }}
                />
              }
            />
          </div>
          <Table>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries({ ...refreshToken, ...introspectData }).map((claimEntry) => {
                const claimName = claimEntry[0];
                const claimValue = claimEntry[1];
                const claimId = `claim-${claimName}`;
                return (
                  <tr key={claimName}>
                    <td>{claimName === 'expiresAt' ? 'expiresAT [Local Storage]' : claimName}</td>
                    <td id={claimId}>
                      {claimName === 'expiresAt' || claimName === 'exp' ? new Date(claimValue * 1000).toString() : claimValue.toString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TabPane>
      ),
    },
  ];

  return (
    <>
      <Tab panes={panes} />
    </>
  );
};

export default Panes;
