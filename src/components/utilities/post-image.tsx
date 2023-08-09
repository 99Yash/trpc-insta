'use client';
import { api } from '@/lib/api/api';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import { toast } from '../ui/use-toast';
import { customToastError } from '@/lib/utils';

//? image for the post Modal
const PostImage = ({
  imageUrl,
  postId,
}: {
  imageUrl: string;
  postId: string;
}) => {
  const apiUtils = api.useContext();

  const addLikeMutation = api.like.addLike.useMutation({
    onSuccess: async () => {
      await apiUtils.post.fetchPost.invalidate({ postId });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: 'Could not like this post',
        variant: 'destructive',
        duration: 1800,
      });
    },
  });

  const addLike = async () => {
    try {
      await addLikeMutation.mutateAsync({ postId });
    } catch (err) {
      customToastError(err);
    }
  };

  return (
    <AspectRatio
      onDoubleClick={addLike}
      className="max-w-[55vw] self-center"
      ratio={16 / 9}
    >
      <Image
        src={imageUrl as string}
        alt={'Cannot preview image'}
        className="object-contain absolute top-0 left-0 w-[100%] h-[100%] bg-black"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
        fill
      />
    </AspectRatio>
  );
};

export default PostImage;
