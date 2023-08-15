'use client';
import { api } from '@/lib/api/api';
import { customToastError } from '@/lib/utils';
import { Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';

type PostButtonProps = {
  postId: string;
  userId?: string;
};

const PostButtons = ({ postId, userId }: PostButtonProps) => {
  const router = useRouter();
  const apiUtils = api.useContext();
  const likes = api.like.getLikesCount.useQuery({ postId });

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
        {userId &&
        likes.data &&
        likes.data.some((like) => like.userId === userId) ? (
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
      {likes.data && likes.data.length > 0 ? (
        <span className="text-sm font-semibold">
          {likes.data?.length}{' '}
          {likes.data && likes.data.length > 1 ? 'likes' : 'like'}{' '}
        </span>
      ) : null}
    </div>
  );
};

export default PostButtons;
