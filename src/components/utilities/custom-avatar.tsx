import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const CustomAvatar = ({ name, imgUrl }: { name: string; imgUrl: string }) => {
  return (
    <Avatar>
      <AvatarImage src={imgUrl} className="rounded-full self-center h-8 w-8 " />
      <AvatarFallback>{`${name?.split(' ')[0]![0]}${
        name?.split(' ')[1] ? name?.split(' ')[1]![0] : ''
      }`}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
