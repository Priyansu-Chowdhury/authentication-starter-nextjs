"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserManagement from "@/components/auth/user-management";
import { cn } from "@/lib/utils";

const getContrastingTextColor = (bgColor: string) => {
  const rgb = bgColor.match(/\d+/g)?.map(Number);
  if (!rgb) return "#000000";
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const generateRandomColor = () => {
  const randomChannel = () => Math.floor(128 + Math.random() * 127);
  return `rgb(${randomChannel()}, ${randomChannel()}, ${randomChannel()})`;
};

const UserProfile = ({ className }: { className?: string }) => {
  const { status, data } = useSession();

  if (status === "loading") {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const bgColor = generateRandomColor();
  const textColor = getContrastingTextColor(bgColor);

  return (
    <Dialog>
      <DialogTrigger>
        <Avatar className={cn("cursor-pointer", className)}>
          <AvatarImage src={data?.user.image || undefined} />
          <AvatarFallback
            style={{
              backgroundColor: bgColor,
              color: textColor,
              fontWeight: 500,
            }}
          >
            {data?.user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle hidden>User Management</DialogTitle>
          <DialogDescription hidden>
            Manage your account and profile settings
          </DialogDescription>
        </DialogHeader>
        <UserManagement />
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
