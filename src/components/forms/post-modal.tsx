import React from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { prisma } from '@/server/db';
import { notFound } from 'next/navigation';

//? the contents of the post modal
const PostModal = async ({ postId }: { postId: string }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: true,
      images: true,
      likes: true,
      user: {
        select: {
          name: true, //? for rendering fallback image
          username: true,
          image: true,
        },
      },
    },
  });

  if (!post) return notFound();

  return (
    <div className="flex">
      <AspectRatio className="max-w-[55vw] self-center" ratio={16 / 9}>
        <Image
          src={post?.images[0]?.url as string}
          alt={post?.caption}
          className="object-contain bg-black"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
          fill
        />
      </AspectRatio>
      {/* //?line separate */}

      {/* //?right side */}
      {/* //todo hide this on smaller screens */}
      <div className="flex flex-col w-[45vw] bg-black ">
        {/* //? header -- user info */}
        <div className="flex pl-4 pt-2 gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={post?.user.image as string}
              alt={post?.user?.username as string}
              className="rounded-full self-center h-8 w-8 "
            />
            <AvatarFallback>{`${post.user.name?.split(
              ' '
            )[0]![0]}${post.user.name?.split(' ')[1]![0]}`}</AvatarFallback>
          </Avatar>
          {/* //todo make the user pic and the username clickable, push to the profile of user. greyed on hover */}
          <p className="text-sm">{post?.user.username}</p>
          {/* //todo paste formatTimeToNow here for the post */}
        </div>
        <hr className="border-0 block w-full h-px mr-4 mt-2 bg-slate-700" />
        {/* //? comments section */}
        <div className="flex flex-col gap-2 w-full pl-4">
          {/* //? first: user's caption ,if any */}
          <div className="flex mt-3">
            {/* //todo replace post user with comment author */}
            <Avatar>
              <AvatarImage
                src={post?.user.image as string}
                alt={post?.user?.username as string}
                className="rounded-full self-center h-8 w-8 "
              />
              <AvatarFallback>{`${post.user.name?.split(
                ' '
              )[0]![0]}${post.user.name?.split(' ')[1]![0]}`}</AvatarFallback>
            </Avatar>
            {/* //? user caption */}
            <div className="flex gap-1 self-center flex-wrap ">
              <p className="text-sm font-semibold hover:text-gray-400 cursor-pointer">
                {post?.user.username}
              </p>
              <p className="text-sm">{post?.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
