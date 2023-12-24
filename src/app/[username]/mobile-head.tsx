'use client';

import { api } from '@/trpc/react';

export default function MobileHead({ username }: { username: string }) {
  const { data: user } = api.user.fetchUser.useQuery({
    username,
  });

  const { data: userFollowerCount } = api.user.fetchFollowerCount.useQuery({
    userId: user?.id!,
  });

  const { data: userFollowingCount } = api.user.fetchFollowingCount.useQuery({
    userId: user?.id!,
  });

  const { data: numberOfPosts } = api.post.fetchPostCount.useQuery({
    username,
  });

  return (
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
  );
}
