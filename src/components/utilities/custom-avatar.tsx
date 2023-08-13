import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const CustomAvatar = ({
  name,
  imgUrl,
}: {
  name?: string | null;
  imgUrl?: string | null;
}) => {
  return (
    <Avatar>
      <AvatarImage
        src={
          imgUrl ??
          'https://cdn.vectorstock.com/i/1000x1000/45/79/male-avatar-profile-picture-silhouette-light-vector-4684579.webp'
        }
        className="rounded-full self-center h-8 w-8 opacity-85 "
      />
      <AvatarFallback>{`${name?.split(' ')[0]![0]}${
        name?.split(' ')[1] ? name?.split(' ')[1]![0] : '?'
      }`}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;
