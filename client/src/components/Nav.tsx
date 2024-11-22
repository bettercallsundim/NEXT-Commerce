"use client";
import useZustand from "@/hooks/useZustand";
import api from "@/lib/api";
import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import SignIn from "./SignIn";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Nav = () => {
  const { user, setUser } = useZustand();
  const router = useRouter()
  async function handleSignOut() {
    await api
      .get("/user/sign-out", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setUser(null);
          router.push("/")
        }
      });
  }
  return (
    <div className=" w-full  px-4 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-x-6">
          {user?.id ? (
            <>
              <Button onClick={handleSignOut}>Log Out</Button>
              <Link href={`/profile/${user?.id}`}>
                <Button>Profile</Button>
              </Link>
            </>
          ) : (
            <SignIn />
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Nav;
