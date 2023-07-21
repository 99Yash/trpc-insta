import CreatePost from '@/components/forms/create-post';
import EditProfile from '@/components/forms/edit-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { prisma } from '@/server/db';
import { clerkClient } from '@clerk/nextjs';

const Page = async ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  const { userId } = params;

  const clerkUser = await clerkClient.users.getUser(userId!);
  //! clerk user is not coming back updated. but it is updated.

  //todo add modals for clicking on the numbers and opening up data(followers and following)

  // const userPosts = await prisma.post.findMany({
  //   where: {
  //     authorId: userId,
  //   },
  // });

  // const userFollowers = await prisma.followers.findMany({
  //   where: {
  //     followerId: userId,
  //   },
  // });

  const userPostCount = await prisma.post.count({
    where: {
      authorId: userId,
    },
  });

  const userFollowerCount = await prisma.followers.count({
    where: {
      followerId: userId,
    },
  });

  return (
    <div className="container pt-8 flex md:flex-row sm:flex-col items-center gap-4 ">
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
      <div className="hidden md:flex md:flex-col gap-1">
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
          <CreatePost />
        </div>
        <h4 className="text-sm md:text-md font-semibold text-gray-400">
          {clerkUser.unsafeMetadata.username as string}
        </h4>
        {clerkUser.unsafeMetadata.bio ? (
          <p className="text-md font-medium text-gray-400">
            {clerkUser.unsafeMetadata.bio as string}
          </p>
        ) : null}

        <div className="hidden md:flex gap-4 text-gray-300">
          <p>
            {userFollowerCount === 1
              ? `${userFollowerCount} follower`
              : ` ${userFollowerCount} followers`}
          </p>
          <p>
            {userPostCount === 1
              ? `${userPostCount} post`
              : ` ${userPostCount} posts`}
          </p>
          {/* <p>
            {following.length === 1
              ? `${following.length} following`
              : ` ${following.length} following`}
          </p> */}
        </div>

        <div className="flex md:hidden gap-4 text-gray-300">
          <p>
            {userFollowerCount === 1
              ? `${userFollowerCount} follower`
              : ` ${userFollowerCount} followers`}
          </p>
          <p>
            {userPostCount === 1
              ? `${userPostCount} post`
              : ` ${userPostCount} posts`}
          </p>
          {/* <p>
            {following.length === 1
              ? `${following.length} following`
              : ` ${following.length} following`}
          </p> */}
        </div>
      </div>
      <div className="flex place-self-start items-center gap-3 md:hidden">
        <div className="flex flex-col">
          <p>
            {userFollowerCount === 1
              ? `${userFollowerCount} `
              : ` ${userFollowerCount} `}
          </p>
          <p className="text-sm text-gray-300">
            {userFollowerCount === 1 ? `follower` : `followers`}
          </p>
        </div>
        <div className="flex flex-col">
          <p>
            {userPostCount === 1 ? `${userPostCount} ` : ` ${userPostCount} `}
          </p>
          <p className="text-sm text-gray-300">
            {userPostCount === 1 ? `post` : `posts`}
          </p>
        </div>
        <p></p>
      </div>
    </div>
  );
};

export default Page;
