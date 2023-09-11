'use client';
import { api } from '@/lib/api/api';
import { customToastError } from '@/lib/utils';
import { Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    <div className="flex flex-col cursor-pointer gap-3">
      {/* //? heart and comment icons */}
      <div className="flex gap-2 ">
        {/* //? clicking in the comment icon will open post modal */}
        {user?.id && likes && likes.some((like) => like.userId === user?.id) ? (
          <Heart
            onClick={addOrRemoveLike}
            className="md:h-8 md:w-8 h-6 w-6 mr-2 fill-pink-600 text-pink-600"
          />
        ) : (
          <Heart
            onClick={addOrRemoveLike}
            className="md:h-8 md:w-8 h-6 w-6 mr-2 hover:text-gray-400"
          />
        )}
        <MessageCircle
          onClick={() => router.push(`/p/${postId}`)}
          className="md:h-8 md:w-8 h-6 w-6 mr-2 transform scale-x-[-1] hover:text-gray-400"
        />
      </div>
      {likes && likes.length > 0 ? (
        <span className="text-sm font-semibold">
          {likes?.length} {likes && likes.length > 1 ? 'likes' : 'like'}{' '}
        </span>
      ) : null}
    </div>
  );
};

export default PostButtons;
