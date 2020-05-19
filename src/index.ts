import { verifyAccessTokenFromGoogle as vatfGoogle } from './handler/google';
import { GoogleConfig } from './config/google';
import { GoogleUser } from './user/google';

export { GoogleUser } from './user/google';
export { GoogleConfig } from './config/google';

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
}
