'use client';
import { api } from '@/lib/api/api';
import { customToastError } from '@/lib/utils';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import { toast } from '../ui/use-toast';
import { useState } from 'react';

const PostImage = ({
  imageUrls,
  postId,
}: {
  imageUrls: Array<string>;
  postId: string;
}) => {
  const apiUtils = api.useContext();
  //TODO flash a heart on double click.
  const [imageUrl, setImageUrl] = useState<string>(imageUrls.at(0) as string);

  const handlePrevImage = () => {
    if (imageUrls.length < 1) return;
    const index = imageUrls.indexOf(imageUrl);
    if (index === 0) return;
    setImageUrl(imageUrls[index - 1] as string);
  };

  const handleNextImage = () => {
    if (imageUrls.length < 1) return;
    const index = imageUrls.indexOf(imageUrl);
    if (index === imageUrls.length - 1) return;
    setImageUrl(imageUrls[index + 1] as string);
  };

  const addLikeMutation = api.like.addLike.useMutation({
    onSuccess: async () => {
      await apiUtils.like.getLikesCount.invalidate({ postId });
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
      className="md:max-w-[55vw] flex items-center self-center"
      ratio={16 / 9}
    >
      {imageUrls.length > 1 && imageUrls.indexOf(imageUrl) !== 0 && (
        <ChevronLeftCircle
          onClick={handlePrevImage}
          className="text-green-500 absolute left-0 cursor-pointer h-6 w-6 z-30 "
        />
      )}
      {imageUrls.length > 1 && imageUrls.indexOf(imageUrl) !== 2 && (
        <ChevronRightCircle
          onClick={handleNextImage}
          className=" absolute right-0 text-green-500 cursor-pointer h-6 w-6 z-30"
        />
      )}
      <Image
        src={imageUrl as string}
        alt={'Cannot preview image'}
        className="object-contain absolute top-0 left-0 w-[100%] h-[100%] bg-gray-950 select-none"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
        fill
      />
      {imageUrls.length > 1 && (
        <span className="rounded-xl p-1 text-sm self-center absolute bottom-1 bg-black text-gray-100/40">
          {imageUrls.indexOf(imageUrl) + 1}/{imageUrls.length}
        </span>
      )}
    </AspectRatio>
  );
};

export default PostImage;
