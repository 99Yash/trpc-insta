'use client';

import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import AddPostButton from '@/components/utilities/add-post-button';
import UserPost from '@/components/utilities/user-post';
import { api } from '@/lib/api/api';

export const UserPosts = ({ username }: { username: string }) => {
  const { data: user } = api.user.fetchUser.useQuery({
    username,
  });

  const { data: posts } = api.post.fetchAllOfUser.useQuery({ username });

  if (!posts)
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="relative pb-[100%]">
            <Skeleton className="absolute inset-0 h-full w-full" />
          </div>
        ))}
      </div>
    );

  if (posts.length === 0 && user?.username === username)
    return (
      <div className="min-h-1/2 flex flex-col gap-4 justify-center items-center">
        <Icons.instagram className="h-10 w-10 text-gray-400 " />
        <h1 className="text-4xl font-bold text-gray-300 ">Share Photos</h1>
        <p className="text-sm text-gray-300 ">
          When you share photos, they will appear on your profile.
        </p>
        <AddPostButton
          variant={'ghost'}
          className="text-blue-400"
          buttonText="Share your first photo"
        />
      </div>
    );

  if (posts.length === 0 && user?.username !== username)
    return (
      <div className="h-1/2 flex flex-col gap-4 justify-center items-center ">
        <Icons.instagram className="h-10 w-10 text-gray-400 " />
        <h1 className="text-4xl font-bold text-gray-300 ">
          Nothing here. Yet.
        </h1>
        <p className="text-sm text-gray-300 ">
          When {username} shares photos, they will appear on this profile.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-3 md:gap-4 sm:gap-2 md:mb-4 sm:mb-2 ">
      {posts.map((post) => (
        //? userPost is the trigger for the post-modal
        <UserPost
          key={post.id}
          postId={post.id}
          firstImageUrl={post.images[0]!.url!}
        />
      ))}
    </div>
  );
};
