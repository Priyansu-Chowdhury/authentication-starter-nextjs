import React from "react";
import { CardFooter } from "@/components/ui/card";
import SocialProviders from "./social-providers";

interface AuthFooterProps {
  social?: boolean;
  text: string;
}

const AuthFooter = ({ text, social = false }: AuthFooterProps) => {
  return (
    <CardFooter>
      <div className="space-y-4">
        {social && <SocialProviders />}
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </CardFooter>
  );
};

export default AuthFooter;
