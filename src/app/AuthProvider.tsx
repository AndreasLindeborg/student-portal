"use client"; // Mark this as a Client Component

import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<Auth0Provider
  domain="dev-qdid10dbjbran1yv.us.auth0.com"
  clientId="4mrkp7Ku8Dn67oku2Hw7mVtUi6ZSZHjp"
  authorizationParams={{
   
    redirect_uri: typeof window !== "undefined"
      ? `${window.location.origin}/dashboard`
      : ""
  }}
>
  {children}
</Auth0Provider>
  );
}

