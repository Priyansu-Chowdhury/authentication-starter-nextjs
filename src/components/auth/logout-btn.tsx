import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogoutBtn = ({ children }: { children?: React.ReactNode }) => {
  const [isPending, startTransition] = useTransition();
  const handleLogout = () => {
    startTransition(() => {
      signOut();
    });
  };

  if (children) {
    return (
      <Button
        variant={"destructive"}
        onClick={handleLogout}
        disabled={isPending}
      >
        <LogOut size={24} />
        {children}
      </Button>
    );
  }
  return (
    <Button variant={"destructive"} onClick={handleLogout} disabled={isPending}>
      <LogOut size={24} />
      Logout
    </Button>
  );
};

export default LogoutBtn;
