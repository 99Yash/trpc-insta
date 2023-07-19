import EditProfile from '@/components/forms/edit-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { prisma } from '@/server/db';
import { clerkClient } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/dist/types/server';
import { notFound } from 'next/navigation';

const Page = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const { userId } = params;
  let clerkUser: User;
  try {
    clerkUser = await clerkClient.users.getUser(userId!);
    if (!clerkUser) return notFound();
  } catch (err) {
    return notFound();
  }

  //todo add modals for clicking on the numbers and opening up data(followers and following)

  const userPosts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });

  const userFollowers = await prisma.followers.findMany({
    where: {
      followerId: userId,
    },
  });

  const following = await prisma.user.findMany({
    where: {
      followers: {
        every: {
          followerId: userId,
        },
      },
    },
  });

  return (
    <div className="container pt-8 mx-auto flex items-center gap-4 ">
      {clerkUser ? (
        <Avatar className="md:h-36 md:w-36 h-20 w-20 border border-slate-950 mb-5">
          <AvatarImage
            src={clerkUser?.imageUrl}
            alt={clerkUser?.firstName || 'You'}
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      ) : (
        <Skeleton className="md:h-36 md:w-36 h-20 w-20" />
      )}
      <div className="flex flex-col gap-1">
        <div className="flex gap-10 items-baseline">
          <h5 className="text-md font-medium ">
            {clerkUser.firstName} {''} {clerkUser.lastName}
          </h5>
          <EditProfile
            username={clerkUser.unsafeMetadata.username as string}
            bio={
              clerkUser.unsafeMetadata.bio
                ? (clerkUser.unsafeMetadata.bio as string)
                : ''
            }
          />
        </div>
        <h4 className="text-sm md:text-md font-semibold text-gray-400">
          @{clerkUser.unsafeMetadata.username as string}
        </h4>
        {clerkUser.unsafeMetadata.bio ? (
          <p className="text-md font-medium text-gray-400">
            {clerkUser.unsafeMetadata.bio as string}
          </p>
        ) : null}

        <div className="hidden md:flex gap-4 text-gray-300">
          <p>
            {userFollowers.length === 1
              ? `${userFollowers.length} follower`
              : ` ${userFollowers.length} followers`}
          </p>
          <p>
            {userPosts.length === 1
              ? `${userPosts.length} post`
              : ` ${userPosts.length} posts`}
          </p>
          <p>
            {following.length === 1
              ? `${following.length} following`
              : ` ${following.length} following`}
          </p>
        </div>

        <div className="flex md:hidden gap-4 text-gray-300">
          <p>
            {userFollowers.length === 1
              ? `${userFollowers.length} follower`
              : ` ${userFollowers.length} followers`}
          </p>
          <p>
            {userPosts.length === 1
              ? `${userPosts.length} post`
              : ` ${userPosts.length} posts`}
          </p>
          <p>
            {following.length === 1
              ? `${following.length} following`
              : ` ${following.length} following`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
