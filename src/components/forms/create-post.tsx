'use client';
import { api } from '@/lib/api/api';
import { addPostSchema } from '@/lib/validators';
import { UploadButton } from '@/utils/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileDialog } from '../file-dialog';
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
  FormItem,
  FormLabel,
  UncontrolledFormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

type addPostResolver = z.infer<typeof addPostSchema>;

const CreatePost = () => {
  const { toast } = useToast();

  const form = useForm<addPostResolver>({
    resolver: zodResolver(addPostSchema),
    mode: 'onChange',
  });

  const { mutate, isLoading } = api.example.createPost.useMutation({
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
      ...inputs,
    });
    toast({
      title: 'Post created',
      description: 'Your post has been created',
      variant: 'default',
    });
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
          <form
            className="grid w-full max-w-2xl gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...form.register('caption')}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.caption?.message}
              />
            </FormItem>

            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Images</FormLabel>
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="imgUrl"
                  maxFiles={3}
                  maxSize={1024 * 1024 * 4}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isPending}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.imgUrl?.message}
              />
            </FormItem>
            <Button className="w-fit" disabled={isPending}>
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add Product
              <span className="sr-only">Add Product</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
