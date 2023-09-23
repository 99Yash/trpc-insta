import CreatePost from '@/components/forms/create-post';
import EditProfile from '@/components/forms/edit-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditProfilePhoto from '@/components/utilities/edit-dp';
import FollowUnfollowBtn from '@/components/utilities/follow-unfollow';
import { getSession } from '@/lib/session';
import { prisma } from '@/server/db';
import { notFound } from 'next/navigation';

export const UserProfile = async ({ username }: { username: string }) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  const userFollowerCount = await prisma.followers.count({
    where: {
      followingId: user?.id,
    },
  });

  const userFollowingCount = await prisma.followers.count({
    where: {
      followerId: user?.id,
    },
  });

  const numberOfPosts = await prisma.post.count({
    where: {
      userId: user?.id,
    },
  });

  if (!user) notFound();
  const session = await getSession();

  return (
    <div className=" flex flex-col w-full md:flex-row md:items-start sm:justify-center sm:items-center md:justify-evenly gap-4 text-gray-300">
      {/* //? avatar and username and buttons */}
      <div className="flex self-start gap-4">
        <Avatar className="md:h-36 md:w-36 h-20 w-20 border rounded-full border-slate-950 mb-5">
          <AvatarImage src={user?.image as string} alt="User" />
          <AvatarFallback>
            {user.name?.split(' ')[0]![0]}
            {user.name?.split(' ')[1] ? user.name?.split(' ')[1]![0] : ''}
          </AvatarFallback>
        </Avatar>
        {/* //? mobile view */}
        <div className="md:hidden flex flex-col ">
          <div className="flex flex-col gap-3 ">
            <h5 className="text-lg font-bold">{user?.username}</h5>
            {/* //? edit profile, add post, edit dp buttons */}
            {session?.user?.id === user?.id && (
              <div className="flex gap-2">
                <CreatePost />
                <EditProfile
                  name={user.name ?? ''}
                  username={username}
                  bio={(user?.bio as string) || ''}
                />
                <EditProfilePhoto
                  photoUrl={user.image as string}
                  name={user.name ?? ''}
                />
              </div>
            )}
            {/* // ? following/follow btns for mobile view */}
            {session?.user?.id !== user?.id && (
              <FollowUnfollowBtn userId={user.id} />
            )}
          </div>
        </div>
      </div>

      {/* //? just for mobile */}
      <div className="flex flex-col md:hidden gap-2">
        <h5 className="text-md self-start md:hidden font-semibold ">
          {user?.name}
        </h5>
        <p className="text-sm self-start whitespace-pre-line md:hidden  text-gray-300">
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
            <h5 className="text-md font-semibold ">{userFollowerCount}</h5>
            <p className="text-sm text-gray-400">
              {userFollowerCount === 1 ? 'Follower' : 'Followers'}
            </p>
          </div>
          <div className="flex flex-col items-center ">
            <h5 className="text-md font-semibold ">{userFollowingCount}</h5>
            <p className="text-sm text-gray-400">Following</p>
          </div>
        </div>
        <hr className="border-0 h-[1px] mt-2 bg-gradient-to-r from-gray-900 via-slate-500 to-gray-900" />
      </div>
      {/* //? non-mobile view */}

      <div className="hidden md:flex md:w-1/2 md:flex-col gap-4">
        <div className="flex md:flex-row gap-10 items-baseline">
          <h5 className="text-md font-bold ">{user?.username}</h5>
          {session?.user?.id === user?.id && (
            <div className="flex gap-2 justify-end ">
              <CreatePost />
              <EditProfile
                name={user.name as string}
                username={username}
                bio={(user?.bio as string) || ''}
              />
              <EditProfilePhoto
                photoUrl={user.image as string}
                name={user.name ?? ''}
              />
            </div>
          )}
          {/* //? following/follow btns for non-mobile view */}
          {session?.user?.id !== user?.id && (
            <FollowUnfollowBtn userId={user.id} />
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
            <h5 className="text-md font-semibold ">{userFollowerCount}</h5>
            <p className="text-sm text-gray-400">
              {userFollowerCount === 1 ? 'follower' : 'followers'}
            </p>
          </div>
          <div className="flex gap-2 justify-center items-center  ">
            <h5 className="text-md font-semibold ">{userFollowingCount}</h5>
            <p className="text-sm text-gray-400">following</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="text-md font-semibold">{user?.name}</h5>
          <p className="text-sm whitespace-pre-line text-gray-300">
            {user?.bio}
          </p>
        </div>
      </div>
    </div>
  );
};
