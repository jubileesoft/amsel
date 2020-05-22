# Amsel

Verify a **Google access token** or a **Microsoft id_token** (for a specific tenant application) and extract its user object in your node backend.

# Installation

Install Amsel using `yarn`:

```bash
yarn add @jubileesoft/amsel
```

Or `npm`:

```bash
npm install @jubileesoft/amsel
```

# Configuration

### Google

```typescript
// typescript example

import amsel, { GoogleConfig } from '@jubileesoft/amsel';

const config: GoogleConfig = {
  appClientId: 'my-client-id-from-google'
};

amsel.initializeGoogle(config);
```

Make sure to call `initializeGoogle` with the appropriate config before validating any tokens.

### Microsoft

```typescript
// typescript example

import amsel, { MicrosoftConfig } from '@jubileesoft/amsel';

const config: MicrosoftConfig = {
  tenantId: 'my-tenant-id-where-the-app-is-registered',
  appId: 'my-app-id'
};

amsel.initializeMicrosoft(config);
```

Make sure to call `initializeMicrosoft` with the appropriate config before validating any tokens.

# Usage

When you process a client-request in your node backend (e.g. from a REST call or GraphQL query), you can use the function `verifyAccessTokenFromGoogle` or `verifyAccessTokenFromMicrosoft` to verify the access token or id_token included in the **authorization header** of the request. 

```typescript
// typescript example 

import { GoogleUser } from '@jubileesoft/amsel';

const user: Promise<GoogleUser | null> = await amsel.verifyAccessTokenFromGoogle(
  req.headers.authorization // should look like "Bearer ...something..."
);
```

The promise either returns null if the token could not be verified or a user object that looks like this:

```typescript
// user object GoogleUser
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

// user object MicrosoftUser
{
  aio:"AUQAu/8PAAAA59n9QoJuFmNVSyERuiK7TLcv9rnW1t4GvzgKdY2rWLcp2KpmeklVU1P7epwwSofFb3BC18Myp6JRkVnkmlntHw=="
  at_hash:"EtHCDTh4GhOq--Txo2gViw"
  aud:"53d235e2-66d1-4312-92d0-c34ff0aa546d"
  email:"Peter.Lustig@wdr.com"
  exp:1590142952
  iat:1590139052
  iss:"https://login.microsoftonline.com/08fcd60a-b77c-4be0-aa28-495621e88734/v2.0"
  name:"Lustig, Peter"
  nbf:1590139052
  nonce:"678910"
  oid:"569a1735-07de-43a3-a72d-d5cf6cadf76f "
  preferred_username:"Peter.Lustig@wdr.com"
  sub:"CLq_tBCeazZek3p8OLoZbngt_V54f44m7hTzrdofaOM"
  tid:"08fcd60a-b77c-4be0-aa28-495621e88734"
  uti:"3s14Gf_EwUiKeW66hmwrAA"
  ver:"2.0"
}
``` 

So, whenever you get a user object you know that the token is currently still valid.

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