import { prisma } from '@/server/db';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AspectRatio } from '../ui/aspect-ratio';
import CustomAvatar from '../utilities/custom-avatar';
import AddComment from './add-comment';

//? the contents of the post modal
const PostModal = async ({ postId }: { postId: string }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        include: {
          user: {
            select: {
              username: true,
              name: true, //? for fallback image
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
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
      <div className="flex flex-grow flex-col w-[45vw] bg-black ">
        {/* //? header -- user info */}
        <div className="flex pl-4 pt-2 gap-2 items-center">
          <CustomAvatar
            imgUrl={post.user.image as string}
            name={post.user.name as string}
          />
          {/* //todo make the user pic and the username clickable, push to the profile of user. greyed on hover */}
          <p className="text-sm">{post?.user.username}</p>
          {/* //todo paste formatTimeToNow here for the post */}
        </div>
        <hr className="border-0 block w-full h-px mr-4 mt-2 bg-slate-700" />
        {/* //? comments section */}
        <div className="flex flex-col justify-between gap-2 w-full pl-4 ">
          {/* //? first: user's caption ,if any */}
          <div className="flex mt-3">
            {/* //todo replace post user with comment author */}
            <CustomAvatar
              imgUrl={post.user.image as string}
              name={post.user.name as string}
            />
            {/* //? user caption */}
            <div className="flex gap-1 pt-2 flex-wrap ">
              <p className="text-sm font-semibold hover:text-gray-400 cursor-pointer">
                {post?.user.username}
              </p>
              <p className="text-sm">{post?.caption}</p>
            </div>
          </div>
          {/* //todo add comments */}
          <div className="flex-grow flex flex-col gap-4 min-h-full">
            {post.comments.map((cmt) => (
              <div key={cmt.id} className="flex flex-wrap gap-1 mt-3">
                <CustomAvatar
                  imgUrl={cmt.user.image as string}
                  name={cmt.user.name as string}
                />
                <p className="text-sm font-semibold">{cmt.user.username}</p>
                <p className="text-sm">{cmt.text}</p>
              </div>
            ))}
          </div>

          <hr className="border-0 block w-full h-px mr-4 mt-2 bg-slate-700" />
          <div className="flex flex-col gap-4">
            {/* //? button group */}
            <div className="flex">
              <Heart className="h-6 w-6 mr-2 " />
              <MessageCircle className="h-6 w-6 mr-2 transform scale-x-[-1]" />
              {/* todo add share btn */}
            </div>
            {/* //? no. of likes here */}
            {/* //? formatTime here */}

            <hr className="border-0 block w-full h-px mr-4 mt-2 bg-slate-700" />
            {/* //* comment form here */}
            <div className="flex gap-4">
              <CustomAvatar
                imgUrl={post.user.image as string}
                name={post.user.name as string}
              />
              <AddComment postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
