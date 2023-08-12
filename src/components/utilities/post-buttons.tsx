'use client';
import { api } from '@/lib/api/api';
import { customToastError } from '@/lib/utils';
import { Heart, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';

//! next/router not supported in app-dir.
type PostButtonProps = {
  post: {
    id: string;
    user?: {
      image: string | null;
      name: string | null;
      username: string | null;
    };
    comments?: Array<{
      id: string;
    }>;
    likes: Array<{
      userId: string;
    }>;
    images?: Array<{
      url: string;
    }>;
    caption?: string | null;
    createdAt?: Date;
  };
  userId?: string;
};

const PostButtons = ({ post, userId }: PostButtonProps) => {
  const apiUtils = api.useContext();
  const router = useRouter();

  const addLikeMutation = api.like.addLike.useMutation({
    onSuccess: async () => {
      await apiUtils.post.fetchPost.invalidate({ postId: post.id });
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
      addLikeMutation.mutate({ postId: post.id });
    } catch (err) {
      customToastError(err);
    }
  };
  return (
    <div className="flex flex-col cursor-pointer gap-3">
      {/* //? heart and comment icons */}
      <div className="flex gap-2 ">
        {/* //? clicking in the comment icon will open post modal */}
        {userId && post.likes.some((like) => like.userId === userId) ? (
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
        {/* //? open post modal on clicking here */}
        <MessageCircle
          onClick={() => router.push(`/p/${post.id}`)}
          className="md:h-8 md:w-8 h-6 w-6 mr-2 transform scale-x-[-1] hover:text-gray-400"
        />
      </div>
      {post.likes && post.likes.length > 0 ? (
        <span className="text-sm font-semibold">
          {post.likes?.length}{' '}
          {post.likes && post.likes.length > 1 ? 'likes' : 'like'}{' '}
        </span>
      ) : null}
    </div>
  );
};

export default PostButtons;
