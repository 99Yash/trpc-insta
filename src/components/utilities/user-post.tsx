'use client';

import React from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type UserPostProps = {
  postId: string;
  firstImageUrl: string;
};

const UserPost = ({ postId, firstImageUrl }: UserPostProps) => {
  const router = useRouter();
  return (
    <AspectRatio
      onClick={() => router.push(`/p/${postId}`)}
      key={postId}
      ratio={1}
      className="cursor-pointer hover:opacity-70 transition-all"
    >
      <Image
        src={firstImageUrl as string}
        alt={'Cant preview Image'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        fill
      />
    </AspectRatio>
  );
};

export default UserPost;
