import { MicrosoftUser } from '../user/microsoft';
import passport from 'passport';

interface Request {
  headers: {
    authorization: string;
  };
}

const authenticate = (req: Request): Promise<MicrosoftUser | null> => {
  return new Promise((resolve, reject) => {
    passport.authenticate('oauth-bearer', function (
      err,
      user: MicrosoftUser,
      info: string
    ) {
      console.log(user);
      if (!user) {
        reject(info);
        return;
      }
      resolve(user);
    })(req);
  });
};

const verifyAccessTokenFromMicrosoft = async (
  authorizationHeader: string
): Promise<MicrosoftUser | null> => {
  // Build required req object from the authorizationHeader.
  const req: Request = {
    headers: {
      authorization: authorizationHeader,
    },
  };

  return authenticate(req);
};

export { verifyAccessTokenFromMicrosoft };
