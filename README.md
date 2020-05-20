# amsel

Verify a Google access token and extract its user object in your node backend.

# Installation

With yarn:

```bash
yarn add @jubileesoft/amsel
```

With npm:

```bash
npm install @jubileesoft/amsel
```

# Configuration

```typescript
// typescript example

import amsel, { GoogleConfig } from '@jubileesoft/amsel';

const config: GoogleConfig = {
  appClientId: 'my-client-id-from-google'
};

amsel.initializeGoogle(config);
```

Make sure to call `initializeGoogle` with the appropriate config before validating any tokens.

# Usage

When you process a client-request in your node backend (e.g. from a REST call or GraphQL query), you can use the function `verifyAccessTokenFromGoogle` to verify the access token included in the **authorization header** of the request. 

```typescript
// typescript example 

import { GoogleUser } from '@jubileesoft/amsel';

const user: Promise<GoogleUser | null> = await amsel.verifyAccessTokenFromGoogle(
  req.headers.authorization // should look like "Bearer ...something..."
);
```

The promise either returns null if the access token could not be verified or a user object that looks like this:

```typescript
// user object
{
  access_type:"online",
  aud:"4xxxxxxxxxx3-qhjjmmug094kpv9b4iu35g65aa34v4u0.apps.googleusercontent.com",
  azp:"4xxxxxxxxxx3-qhjjmmug094kpv9b4iu35g65aa34v4u0.apps.googleusercontent.com",
  email:"peter.lustig@gmail.com",
  email_verified:"true",
  exp:"1589920584",
  expires_in:"3502",
  scope:"openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  sub:"10769150350006150715113082367"
}
``` 

So, whenever you get a user object you know that the access token is currently still valid.

# GraphQL Apollo Server v2 example

The following example shows how an instance of the [ApolloServer](https://www.apollographql.com/docs/apollo-server/security/authentication/) could be created while putting the user object on the context.

```typescript
import amsel from '@jubileesoft/amsel';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const notAuthenticated = { user: null };

    try {
      const user = await amsel.verifyAccessTokenFromGoogle(
        req.headers.authorization
      );
      return { user };
    } catch (e) {
      return notAuthenticated;
    }
  }
});
```

The user object on the context is then available within any resolvers where you can decide what to do. 