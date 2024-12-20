import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthHeaderProps {
  title: string;
  details: string;
}

const AuthHeader = ({ details, title }: AuthHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{details}</CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
