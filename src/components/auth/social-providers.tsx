import React from "react";
import { Linkedin, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

const Socials = [
  {
    icon: Linkedin,
    name: "LinkedIn",
  },
  {
    icon: Github,
    name: "Github",
  },
  {
    icon: Chrome,
    name: "Chrome",
  },
];

const SocialProviders = () => {
  return (
    <div className="gap-2 flex justify-between">
      {Socials.map((social, key) => {
        return (
          <Button key={key} variant={"outline"}>
            <social.icon size={16} />
            {social.name}
          </Button>
        );
      })}
    </div>
  );
};

export default SocialProviders;
