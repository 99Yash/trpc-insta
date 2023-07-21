'use client';
import { api } from '@/lib/api/api';
import { addPostSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileImage, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
type addPostResolver = z.infer<typeof addPostSchema>;
const CreatePost = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(addPostSchema),
    defaultValues: {
      image: '',
      caption: '',
    } satisfies addPostResolver,
  });

  const { mutate, isLoading } = api.example.updatePicture.useMutation({
    onSuccess: () => {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated',
        variant: 'default',
        duration: 1300,
      });
    },
    onError: (err) =>
      toast({
        title: 'Uh oh..',
        description: err.message,
        variant: 'destructive',
        duration: 1900,
      }),
  });

  const onSubmit = (inputs: addPostResolver) => {
    mutate({
      image: inputs.image,
      caption: inputs.caption,
    });
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="m-2">
          <Icons.image className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-gray-300 mb-4">Add Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Caption</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register('caption')}
                      placeholder={'Enter Caption'}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a catchy title that makes your post interesting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...form.register('image')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any picture you feel worth sharing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="m-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
