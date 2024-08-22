"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface UserAvatarProps {
  name: string;
  src?: string;
  isProfile?: boolean; 
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, src, isProfile }) => {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{name && name[0]}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
