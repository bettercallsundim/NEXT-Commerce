"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "react-hot-toast";
import UserContext from "./UserContext";
type Props = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();

const GoogleProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
      >
        <UserContext>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </UserContext>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default GoogleProvider;
