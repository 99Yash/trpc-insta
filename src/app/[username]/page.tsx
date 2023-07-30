import CreatePost from '@/components/forms/create-post';
import EditProfile from '@/components/forms/edit-profile';
import PostImageCarousel from '@/components/post-image-carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import AddPostButton from '@/components/utilities/add-post-button';
import { getCurrentUser, getSession } from '@/lib/session';
import { prisma } from '@/server/db';
import { StoredFile } from '@/types';
import { Instagram } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Prisma } from '@prisma/client';

const page = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const { username } = params;
  const user = await getCurrentUser();

  const UserProfile = async () => {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    const numberOfPosts = await prisma.post.count({
      where: {
        userId: user?.id,
      },
    });

    if (!user) return notFound();
    const session = await getSession();
    //todo if this is not the user's profile page, add following/follow buttons
    return (
      <div className="h-9/10 flex flex-col md:flex-row md:items-start sm:justify-center sm:items-center md:justify-evenly gap-4 text-gray-300">
        {/* //? avatar and username and buttons */}
        <div className="flex self-start gap-4">
          <Avatar className="md:h-36 md:w-36 h-20 w-20 border border-slate-950 mb-5">
            <AvatarImage src={user?.image as string} alt="You" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          {/* //? mobile view */}
          <div className="md:hidden flex flex-col ">
            <div className="flex flex-col gap-3 ">
              <h5 className="text-lg font-semibold">{user?.username}</h5>
              {session?.user?.id === user?.id && (
                <div className="flex gap-2">
                  <CreatePost />
                  <EditProfile
                    username={username as string}
                    bio={(user?.bio as string) || ''}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* //? just for mobile */}
        <div className="flex flex-col md:hidden gap-2">
          <h5 className="text-md self-start md:hidden  font-semibold ">
            {user?.name}
          </h5>
          <p className="text-sm self-start md:hidden  text-gray-300">
            {user?.bio}
          </p>
          <hr className="border-0 h-[1px] mt-2 bg-gradient-to-r from-gray-900 via-slate-500 to-gray-900" />
          {/* //? row of numbers(posts, following, followers) */}
          <div className="grid grid-cols-3 justify-evenly">
            <div className="flex flex-col items-center ">
              <h5 className="text-md font-semibold ">{numberOfPosts}</h5>
              <p className="text-sm text-gray-400">
                {numberOfPosts === 1 ? 'post' : 'posts'}
              </p>
            </div>

            <div className="flex flex-col items-center ">
              <h5 className="text-md font-semibold ">0</h5>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="flex flex-col items-center ">
              <h5 className="text-md font-semibold ">0</h5>
              <p className="text-sm text-gray-400">Following</p>
            </div>
          </div>
          <hr className="border-0 h-[1px] mt-2 bg-gradient-to-r from-gray-900 via-slate-500 to-gray-900" />
        </div>
        {/* //? non-mobile view */}
        {/* //todo show post, following and followers */}
        <div className="hidden md:flex md:w-1/2 md:flex-col gap-4">
          <div className="flex md:flex-row gap-10 items-baseline">
            <h5 className="text-md font-medium ">{user?.username}</h5>
            {session?.user?.id === user?.id && (
              <div className="flex gap-2 justify-end ">
                <CreatePost />
                <EditProfile
                  username={username as string}
                  bio={(user?.bio as string) || ''}
                />
              </div>
            )}
          </div>
          <div className="flex gap-8 items-center ">
            <div className="flex gap-2 justify-center items-center  ">
              <h5 className="text-md font-semibold ">{numberOfPosts}</h5>
              <p className="text-sm text-gray-400">
                {numberOfPosts === 1 ? 'post' : 'posts'}
              </p>
            </div>
            <div className="flex gap-2 justify-center items-center ">
              <h5 className="text-md font-semibold ">0</h5>
              <p className="text-sm text-gray-400">followers</p>
            </div>
            <div className="flex gap-2 justify-center items-center  ">
              <h5 className="text-md font-semibold ">0</h5>
              <p className="text-sm text-gray-400">following</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="text-md font-semibold ">{user?.name}</h5>
            <p className="text-sm text-gray-300">{user?.bio}</p>
          </div>
        </div>
      </div>
    );
  };

  const UserPosts = async () => {
    const postsByUser = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
      },
      include: { images: true },
    });
    //todo make it 0. put this in center
    if (postsByUser.length === 0 && user?.username === username)
      return (
        <div className="h-1/2 flex flex-col gap-4 justify-center items-center">
          <Instagram className="h-10 w-10 text-gray-400 " />
          <h1 className="text-4xl font-bold text-gray-300 ">Share Photos</h1>
          <p className="text-sm text-gray-300 ">
            When you share photos, they will appear on your profile.
          </p>
          {/* //?add 1st post button */}
          <AddPostButton
            variant={'ghost'}
            className="text-blue-400"
            buttonText="Share your first photo"
          />
        </div>
      );
    if (postsByUser.length === 0 && user?.username !== username)
      return (
        <div className="h-1/2 flex flex-col gap-4 justify-center items-center ">
          <Instagram className="h-10 w-10 text-gray-400 " />
          <h1 className="text-4xl font-bold text-gray-300 ">Share Photos</h1>
          <p className="text-sm text-gray-300 ">
            When {username} shares photos, they will appear on their profile.
          </p>
        </div>
      );
    return (
      <div className="block">
        {postsByUser.map((post) => (
          <PostImageCarousel key={post.id} images={post.images} />
        ))}
      </div>
    );
  };

  return (
    <div className=" flex flex-col gap-4 w-full">
      <Suspense
        fallback={
          <Skeleton className="md:h-36 md:w-36 h-20 w-20 border rounded-full border-slate-950 mb-5" />
        }
      >
        <UserProfile />
      </Suspense>
      <hr className="border-0 hidden md:block h-[1px] mt-2 bg-slate-700  " />
      <Suspense fallback={<Skeleton className="grid grid-cols-3" />}>
        <UserPosts />
      </Suspense>
    </div>
  );
};

export default page;
