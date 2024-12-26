"use client";
import React from "react";
import { Linkedin, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const Socials = [
  {
    icon: Linkedin,
    name: "LinkedIn",
    onClick: () => {
      signIn("linkedin");
    },
  },
  {
    icon: Github,
    name: "Github",
    onClick: () => {
      signIn("github");
    },
  },
  {
    icon: Chrome,
    name: "Chrome",
    onClick: () => {
      signIn("google");
    },
  },
];

const SocialProviders = () => {
  return (
    <div className="gap-2 flex justify-between">
      {Socials.map((social, key) => {
        return (
          <Button key={key} variant={"outline"} onClick={social.onClick}>
            <social.icon size={16} />
            {social.name}
          </Button>
        );
      })}
    </div>
  );
};

export default SocialProviders;
