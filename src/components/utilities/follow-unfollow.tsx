'use client';

import { api } from '@/lib/api/client';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { customToastError } from '@/lib/utils';

const FollowUnfollowBtn = ({ userId }: { userId: string }) => {
  //* this userId prop refers to the user whose profile is being viewed, not the current user
  const apiUtils = api.useContext();
  const currentUser = api.user.fetchCurrentUser.useQuery();
  const { data } = api.user.fetchFollowerIds.useQuery({
    id: userId,
  });
  const followMutation = api.user.followOrUnfollow.useMutation({
    onSuccess: async () => {
      await apiUtils.user.fetchFollowerIds.invalidate({ id: userId });
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
        data &&
        data.length > 0 &&
        data?.some(
          (followerIdObj) => followerIdObj.followerId === currentUser.data?.id
        )
          ? 'link'
          : 'secondary'
      }
    >
      {data &&
      data.length > 0 &&
      data?.some(
        (followerIdObj) => followerIdObj.followerId === currentUser.data?.id
      )
        ? 'Following'
        : 'Follow'}
    </Button>
  );
};

export default FollowUnfollowBtn;
