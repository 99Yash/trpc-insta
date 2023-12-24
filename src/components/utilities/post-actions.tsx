'use client';

import { api } from '@/trpc/react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from '../ui/use-toast';
import { manualDialogClose } from '@/lib/utils';

export default function PostActions({ postId }: { postId: string }) {
  const apiUtils = api.useContext();

  const deletePostMutation = api.post.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.post.fetchAllOfUser.invalidate();
      await apiUtils.post.fetchAll.invalidate();
      toast({
        description: 'Post deleted successfully',
        duration: 1200,
      });
    },
    onError: () => {
      toast({
        description: 'An error occurred while deleting your post',
        variant: 'destructive',
        duration: 800,
      });
    },
  });

  const handleDelete = () => {
    try {
      deletePostMutation.mutateAsync({
        postId,
      });
      manualDialogClose();
    } catch (err: any) {
      toast({
        description: 'An error occurred while deleting your post',
        variant: 'destructive',
        duration: 800,
      });
    }
  };

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Icons.more className="h-4 w-4 cursor-pointer hover:text-gray-400 " />
      </DialogTrigger>
      <DialogContent>
        <Dialog modal>
          <DialogTrigger className="flex items-center hover:opacity-60 justify-center gap-2">
            <Icons.trash className="h-4 w-4 text-red-500" />
            <span className="text-sm ">Delete Post</span>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center">
            <DialogHeader className="flex flex-col gap-2">
              <DialogTitle>
                Are you sure you want to delete this Post?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={handleDelete}
              disabled={deletePostMutation.isLoading}
              variant={'destructive'}
              className="text-sm self-end"
            >
              {deletePostMutation.isLoading && (
                <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
