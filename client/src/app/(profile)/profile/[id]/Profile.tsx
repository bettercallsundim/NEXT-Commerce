"use client";
import CreateShop from "@/app/(shop)/_components/CreateShop";
import ShopList from "@/app/(shop)/_components/ShopList";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/queries";
import React from "react";

type Props = {};

const Profile = (props: Props) => {
  // const { data: user } = useAuth();
  // console.log("🚀 ~ page ~ user:", user);
  return (
    <div className="flex h-full">
      <div className="w-[20%] flex flex-col p-4 items-start justify-around h-full">
        <CreateShop />
        <ShopList />
      </div>
      <div className="w-[80%] h-full"></div>
    </div>
  );
};

export default Profile;
