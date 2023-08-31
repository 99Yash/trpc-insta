'use client';

import { api } from '@/lib/api/client';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { customToastError } from '@/lib/utils';

const FollowUnfollowBtn = ({ userId }: { userId: string }) => {
  const apiUtils = api.useContext();
  //todo see if user follows user, if yes, show unfollow btn, else show follow btn
  //? this userId prop doesnt refer to the current user, it refers to the user whose profile is being viewed

  const followerIds = api.user.fetchFollowerIds.useQuery({
    id: userId,
  });
  const followMutation = api.user.followOrUnfollow.useMutation({
    onSuccess: async () => {
      await apiUtils.user.fetchFollowerIds.invalidate({ id: userId });
      toast({
        description: `You are now following!`,
      });
    },
    onError: (err) => {
      toast({
        description: err.message,
        variant: 'destructive',
        duration: 800,
      });
    },
  });

  const followUserHandler = async () => {
    try {
      await followMutation.mutateAsync({
        id: userId,
      });
    } catch (err) {
      customToastError(err);
    }
  };

  return (
    <Button
      onClick={followUserHandler}
      variant={
        followerIds.data &&
        followerIds.data.length > 0 &&
        followerIds.data?.some(
          (followerIdObj) => followerIdObj.followerId === userId
        )
          ? 'link'
          : 'secondary'
      }
    >
      {followerIds.data &&
      followerIds.data.length > 0 &&
      followerIds.data?.some(
        (followerIdObj) => followerIdObj.followerId === userId
      )
        ? 'Following'
        : 'Follow'}
    </Button>
  );
};

export default FollowUnfollowBtn;
