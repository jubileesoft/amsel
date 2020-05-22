import passport from 'passport';
import {
  BearerStrategy,
  IBearerStrategyOptionWithRequest,
} from 'passport-azure-ad';
import { verifyAccessTokenFromGoogle as vatfGoogle } from './handler/google';
import { verifyAccessTokenFromMicrosoft as vatfMicrosoft } from './handler/microsoft';
import { GoogleConfig } from './config/google';
import { MicrosoftConfig } from './config/microsoft';
import { GoogleUser } from './user/google';
import { MicrosoftUser } from './user/microsoft';

export { GoogleUser } from './user/google';
export { MicrosoftUser } from './user/microsoft';
export { GoogleConfig } from './config/google';
export { MicrosoftConfig } from './config/microsoft';

export default class Amsel {
  // #region Google

  private static googleConfig: GoogleConfig;

  public static initializeGoogle(config: GoogleConfig): void {
    Amsel.googleConfig = config;
  }

  public static async verifyAccessTokenFromGoogle(
    authorizationHeader: string
  ): Promise<GoogleUser | null> {
    return vatfGoogle(authorizationHeader, Amsel.googleConfig);
  }

  // #endregion Google

  // #region Microsoft

  private static microsoftConfig: MicrosoftConfig;
  private static isPassportInitialized = false;

  public static initializeMicrosoft(config: MicrosoftConfig): void {
    Amsel.microsoftConfig = config;

    const options: IBearerStrategyOptionWithRequest = {
      identityMetadata: `https://login.microsoftonline.com/${Amsel.microsoftConfig.tenantId}/.well-known/openid-configuration`,
      clientID: Amsel.microsoftConfig.appId,
      passReqToCallback: false,
      loggingLevel: 'info',
      loggingNoPII: false,
      validateIssuer: true,
      issuer: `https://login.microsoftonline.com/${Amsel.microsoftConfig.tenantId}/v2.0`,
    };

    const bearerStrategy = new BearerStrategy(
      options,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (token: any, done: any) => {
        done(null, token);
      }
    );

    passport.use(bearerStrategy);
    passport.initialize();
  }

  public static async verifyAccessTokenFromMicrosoft(
    authorizationHeader: string
  ): Promise<MicrosoftUser | null> {
    return vatfMicrosoft(authorizationHeader);
  }

  // #endregion Microsoft
}
