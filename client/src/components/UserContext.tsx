"use client";
import useZustand from "@/hooks/useZustand";
import api from "@/lib/api";
import { googleLogout } from "@react-oauth/google";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const UserContext = ({ children }: Props) => {
  const { setUser } = useZustand();

  async function authPersist() {
    try {
      const res = await api.get("/user/authPersist", {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        throw new Error("User not found");
      }
    } catch (err: unknown) {
      setUser(null);
      // signOut();
      googleLogout();
    }
  }
  useEffect(() => {
    authPersist();
  }, []);
  return children;
};

export default UserContext;
