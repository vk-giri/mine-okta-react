import config from '../src/config';

export const fetchIntrospectData = async (refreshToken) => {
  try {
    const data = {
      token_type_hint: 'refresh_token',
      token: refreshToken,
    };

    // Convert the data object into URL-encoded string
    const formData = new URLSearchParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    const response = await fetch(`${config.oidc.issuer}/v1/introspect?client_id=${config.oidc.clientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failure while hitting introspect endpoint');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};
