"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ManagementForm from "./form/management-form";
import { useSession } from "next-auth/react";
import { Settings2 } from "lucide-react";

const UserManagement = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <Card className="shadow-none border-none p-0 space-y-4">
      <CardHeader className="p-0">
        <CardTitle className="flex gap-2 items-center">
          <Settings2 className="w-6 h-6 mr-2" />
          Manage your account
        </CardTitle>
        <CardDescription>
          You can manage your account and profile settings here
        </CardDescription>
      </CardHeader>
      <ManagementForm />
    </Card>
  );
};

export default UserManagement;
