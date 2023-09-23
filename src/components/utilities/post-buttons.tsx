'use client';
import { api } from '@/lib/api/api';
import { customToastError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Icons } from '../icons';
import { toast } from '../ui/use-toast';

type PostButtonProps = {
  postId: string;
};

const PostButtons = ({ postId }: PostButtonProps) => {
  const router = useRouter();
  const apiUtils = api.useContext();
  const { data: user } = api.user.fetchCurrentUser.useQuery();
  const { data: likes } = api.like.getLikesCount.useQuery({ postId });

  const addLikeMutation = api.like.addLike.useMutation({
    onSuccess: async () => {
      await apiUtils.like.getLikesCount.invalidate({ postId });
    },
    onError: (err) => {
      toast({
        description: err.message,
        variant: 'destructive',
        duration: 800,
      });
    },
  });

  const addOrRemoveLike = async () => {
    try {
      addLikeMutation.mutateAsync({ postId });
    } catch (err) {
      customToastError(err);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 ">
        {!likes ? (
          <p className="text-gray-400 animate-pulse ">Fetching likes...</p>
        ) : user?.id && likes?.some((like) => like.userId === user?.id) ? (
          <>
            <Icons.heart
              onClick={addOrRemoveLike}
              className="md:h-8 md:w-8 h-6 w-6 mr-2 cursor-pointer fill-pink-600 text-pink-600"
            />
            <Icons.comment
              onClick={() => router.push(`/post/${postId}`)}
              className="md:h-8 md:w-8 h-6 w-6 cursor-pointer hover:text-gray-400"
            />
          </>
        ) : (
          <>
            <Icons.heart
              onClick={addOrRemoveLike}
              className="md:h-8 md:w-8 h-6 w-6 mr-2 cursor-pointer hover:text-gray-400"
            />
            <Icons.comment
              onClick={() => router.push(`/post/${postId}`)}
              className="md:h-8 md:w-8 h-6 w-6 cursor-pointer hover:text-gray-400"
            />
          </>
        )}
      </div>
      {likes && (
        <span className="text-sm font-semibold">
          {likes?.length} {likes && likes.length > 1 ? 'likes' : 'like'}{' '}
        </span>
      )}
    </div>
  );
};

export default PostButtons;
