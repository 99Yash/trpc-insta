import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { prisma } from '@/server/db';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

type PostIdPageProps = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({
  params,
}: PostIdPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  if (!post) return notFound();
  return {
    title: `${post.caption} • @${post.user.username}`,
    description: post.caption,
    openGraph: {
      title: `
      ${post.user.name} (@${post.user.username}) • Trinsta.
      `,
      description: post.caption ? post.caption : '',
      images: [
        {
          url: post.user.image as string,
          width: 400,
          height: 400,
        },
      ],
    },
  };
}

const PostPage = async ({ params }: PostIdPageProps) => {
  const { postId } = params;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      //todo uncomment
      // comments: true,
      // likes: true,
      images: true,
      user: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!post) return notFound();

  return (
    <div className="max-h-fit min-w-max">
      <div className="flex flex-[1] justify-center w-2/3 ">
        <AspectRatio
          className=" flex-[3] max-h-full items-center flex relative"
          ratio={1}
        >
          <Image
            src={post?.images[0]?.url as string}
            alt={post?.caption}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
            fill
          />
          <div className="absolute top-0 right-0 h-full w-px bg-gray-500"></div>
        </AspectRatio>
        {/* //?right side */}
        <div className="self-stretch flex-[2] bg-black ">
          {/* //? header -- user info */}
          <div className="flex pl-4 pt-2 gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={post?.user.image as string}
                alt={post?.user?.username as string}
                className="rounded-full self-center h-8 w-8 "
              />
              <AvatarFallback>{`${post?.user.name?.split(' ')[0]![0]}${
                post?.user.name?.split(' ')[1]
                  ? post?.user.name?.split(' ')[1]![0]
                  : ''
              }`}</AvatarFallback>
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
                <AvatarFallback>{`${post?.user.name?.split(' ')[0]![0]}${
                  post?.user.name?.split(' ')[1]
                    ? post?.user.name?.split(' ')[1]![0]
                    : ''
                }`}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex gap-2 flex-wrap h-full">
              <p className="text-sm">{post?.user.username}</p>
              <p className="text-sm">{post?.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
