// https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens

export interface MicrosoftUser {
  aio: string;
  at_hash?: string;
  aud: string;
  email?: string;
  exp: number;
  iat: number;
  iss: string;
  name?: string;
  nbf: number;
  nonce: string;
  oid: string;
  preferred_username?: string;
  sub: string;
  tid?: string;
  uti: string;
  ver: string;
}
