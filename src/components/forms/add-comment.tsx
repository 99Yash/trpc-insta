'use client';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api/api';
import { cn, customToastError } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const AddComment = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState('');
  const apiUtils = api.useContext();

  const addCommentMutation = api.comment.addComment.useMutation({
    onSuccess: async () => {
      await apiUtils.post.fetchPost.invalidate({ postId });
      toast({
        title: 'Done!',
        description: 'Comment added successfully',
        duration: 1200,
      });
    },
    onError: () => {
      toast({
        title: 'Error!',
        description: 'An error occurred while adding your comment',
        variant: 'destructive',
        duration: 1800,
      });
    },
  });

  const onSubmit = async () => {
    try {
      await addCommentMutation.mutateAsync({ postId, text: comment });
      setComment('');
    } catch (err: any) {
      customToastError(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <>
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          'border-none border-transparent focus-visible:border-transparent focus-visible:border-none mr-3 '
        )}
        placeholder="Add a comment..."
      />
      {comment.length > 0 ? (
        <Button
          disabled={addCommentMutation.isLoading}
          onClick={onSubmit}
          variant={'ghost'}
        >
          {addCommentMutation.isLoading && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Post
        </Button>
      ) : null}
    </>
  );
};

export default AddComment;
