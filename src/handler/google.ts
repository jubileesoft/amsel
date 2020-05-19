import fetch from 'node-fetch';
import { GoogleUser } from '../user/google';
import { Google, GoogleConfig } from '../config/google';

const verifyAccessTokenFromGoogle = async (
  authorizationHeader: string,
  config: GoogleConfig
): Promise<GoogleUser | null> => {
  if (!config?.appClientId) {
    throw new Error(
      'Please make sure to call initializeGoogle(config) with an appropriate config first.'
    );
  }

  // Check if the authorization header is available
  if (!authorizationHeader) {
    return null;
  }

  // Extract the token from the authorization header
  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  const res = await fetch(Google.tokenInfoUrl + token, {
    method: 'GET',
    compress: false,
  });

  const buffer = res.body.read();
  const text = buffer.toString('utf8');
  const user: GoogleUser = JSON.parse(text);
  if (typeof user.aud === 'undefined' || user.aud !== config.appClientId) {
    return null;
  }

  return user;
};

export { verifyAccessTokenFromGoogle };
