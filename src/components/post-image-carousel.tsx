import { StoredFile } from '@/types';
import { EmblaOptionsType } from 'embla-carousel-react';
import React from 'react';

interface ProductImageCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: StoredFile[];
  options?: EmblaOptionsType;
}

const PostImageCarousel = () => {
  return <div>PostImageCarousel</div>;
};

export default PostImageCarousel;
