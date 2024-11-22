"use client";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useSignIn } from "../hooks/queries";

const SignIn = () => {
  const { mutate: signIn } = useSignIn();
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const {
          email,
          name,
          picture,
        }: {
          email: string;
          name: string;
          picture: string;
        } = jwtDecode(credentialResponse.credential as string);
        if (email) {
          signIn({ email, name, picture });
        }
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default SignIn;
