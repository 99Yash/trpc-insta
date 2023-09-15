'use client';
import CreatePost from '@/components/forms/create-post';
import EditProfile from '@/components/forms/edit-profile';
import EditProfilePhoto from '@/components/utilities/edit-dp';
import FollowUnfollowBtn from '@/components/utilities/follow-unfollow';
import { api } from '@/lib/api/api';

const SmProfile = ({ username }: { username: string }) => {
  const { data: user } = api.user.fetchCurrentUser.useQuery();

  return (
    <div className="md:hidden flex flex-col ">
      <div className="flex flex-col gap-3 ">
        <h5 className="text-lg font-bold">{user?.username}</h5>
        {/* //? edit profile, add post, edit dp buttons */}
        {user?.username === username && (
          <div className="flex gap-2">
            <CreatePost />
            <EditProfile
              name={user?.name ?? ''}
              username={username}
              bio={user?.bio || ''}
            />
            <EditProfilePhoto
              photoUrl={user?.image as string}
              name={user?.name ?? ''}
            />
          </div>
        )}
        {/* // ? following/follow btns for mobile view */}
        {user && user.username !== username && (
          <FollowUnfollowBtn userId={user.id} />
        )}
      </div>
    </div>
  );
};

export default SmProfile;
