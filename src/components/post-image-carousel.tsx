'use client';

import { StoredFile } from '@/types';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import { Image as Placeholder } from 'lucide-react';
import React from 'react';

interface PostImageCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: StoredFile[];
  options?: EmblaOptionsType;
}

const PostImageCarousel = ({
  images,
  className,
  options,
  ...props
}: PostImageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  images.length === 0 ? (
    <div
      aria-label="Product Placeholder"
      role="img"
      aria-roledescription="placeholder"
      className="flex aspect-square h-full w-full flex-1 items-center justify-center "
    >
      <Placeholder className="h-9 w-9 " aria-hidden="true" />
    </div>
  ) : null;

  return <div>PostImageCarousel</div>;
};

export default PostImageCarousel;
