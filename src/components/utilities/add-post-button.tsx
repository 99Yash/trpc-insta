'use client';

import React from 'react';
import { Button, ButtonProps } from '../ui/button';
import { openAddPostModal } from '@/lib/utils';

interface AddPostButtonProps extends ButtonProps {
  buttonText?: string;
}
const AddPostButton = ({ buttonText, ...props }: AddPostButtonProps) => {
  return (
    <Button onClick={openAddPostModal} {...props}>
      {buttonText ? buttonText : 'New Post'}
    </Button>
  );
};

export default AddPostButton;
