"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Logout Button Component
 *
 * This component renders a button that:
 * - Redirects the user to a login page if they are unauthenticated.
 * - Logs out the user if they are authenticated.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} [props.children] - Optional children to display inside the button.
 *                                             Defaults to "Sign In" or "Sign Out" based on the session status.
 * @param {string} [props.className] - Optional CSS class to style the button.
 * @param {string} [props.loginPath="/login"] - The path to redirect unauthenticated users to the login page.
 *
 * @example
 * // Usage in a React component
 * <LogoutBtn className="custom-class" loginPath="/custom-login">
 *   Custom Login Text
 * </LogoutBtn>
 *
 * @returns {JSX.Element|null} A button component or null if the session is still loading.
 */

const LogoutBtn = ({
  children,
  className,
  loginPath = "/login",
}: {
  children?: React.ReactNode;
  className?: string;
  loginPath?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const { status } = useSession();
  const router = useRouter();

  const handleRedirect = () => {
    router.push(loginPath);
  };

  const handleLogout = () => {
    startTransition(() => {
      signOut();
    });
  };

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return (
      <Button
        onClick={handleRedirect}
        className={cn(className)}
        disabled={isPending}
        type="button"
        effect={"expandIcon"}
        icon={LogIn}
        iconPlacement="left"
      >
        {children ? children : "Sign In"}
      </Button>
    );
  }

  return (
    <Button
      variant={"destructive"}
      className={cn(className)}
      onClick={handleLogout}
      disabled={isPending}
      type="button"
      effect={"expandIcon"}
      icon={LogOut}
      iconPlacement="left"
    >
      {children ? children : "Sign Out"}
    </Button>
  );
};

export default LogoutBtn;
