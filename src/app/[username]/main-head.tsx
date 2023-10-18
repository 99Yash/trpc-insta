'use client';
import CreatePost from '@/components/forms/create-post';
import EditProfile from '@/components/forms/edit-profile';
import EditProfilePhoto from '@/components/utilities/edit-dp';
import FollowUnfollowBtn from '@/components/utilities/follow-unfollow';
import { api } from '@/lib/api/api';

const MdHead = ({ username }: { username: string }) => {
  const { data: user } = api.user.fetchUser.useQuery({
    username,
  });

  const { data: currentUser } = api.user.fetchCurrentUser.useQuery();

  const { data: userFollowerCount } = api.user.fetchFollowerCount.useQuery({
    userId: user?.id as string,
  });

  const { data: userFollowingCount } = api.user.fetchFollowingCount.useQuery({
    userId: user?.id as string,
  });

  const { data: numberOfPosts } = api.post.fetchPostCount.useQuery({
    username,
  });

  return (
    <div className="hidden md:flex md:w-1/2 md:flex-col gap-4">
      <div className="flex md:flex-row gap-10 items-baseline">
        <h5 className="text-md font-bold ">{user?.username}</h5>
        {user?.id === currentUser?.id && (
          <div className="flex gap-2 justify-end ">
            <CreatePost />
            <EditProfile
              name={user?.name as string}
              username={username}
              bio={(user?.bio as string) || ''}
            />
            <EditProfilePhoto
              photoUrl={user?.image as string}
              name={user?.name ?? ''}
            />
          </div>
        )}
        {/* //? following/follow btns for non-mobile view */}
        {currentUser?.id !== user?.id && (
          <FollowUnfollowBtn userId={user!.id} />
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
        <p className="text-sm whitespace-pre-line text-gray-300">{user?.bio}</p>
      </div>
    </div>
  );
};

export default MdHead;
