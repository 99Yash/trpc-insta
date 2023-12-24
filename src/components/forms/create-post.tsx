'use client';
import { api } from '@/trpc/react';
import { customToastError, manualDialogClose } from '@/lib/utils';
import { addPostSchema } from '@/lib/validators';
import { FileWithPreview } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { Zoom } from '../zoom-image';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

type AddPostSchema = z.infer<typeof addPostSchema>;

const CreatePost = () => {
  const defaultValues: AddPostSchema = {
    caption: '',
    images: null,
  };
  const { toast } = useToast();
  const apiCtx = api.useUtils();
  const [files, setFiles] = useState<FileWithPreview[] | null>(null);

  const { useUploadThing } = generateReactHelpers<OurFileRouter>()
  const { isUploading, startUpload } = useUploadThing('postImageUploader');

  const form = useForm<AddPostSchema>({
    resolver: zodResolver(addPostSchema),
    defaultValues,
    mode: 'onChange',
  });

  const previews = form.watch('images') as FileWithPreview[] | null;

  const { data: user } = api.user.fetchCurrentUser.useQuery();

  if (!user) return <p>Error: User not found</p>;

  const addPostMutation = api.post.addPost.useMutation({
    onSuccess: async () => {
      await apiCtx.post.fetchAllOfUser.invalidate({ username: user.username! });
      toast({
        title: 'Post created',
        description: 'Your post has been created',
        variant: 'default',
        duration: 1300,
      });
    },
    onError: (err) =>
      toast({
        title: 'Uh oh..',
        description: err.message,
        variant: 'destructive',
        duration: 900,
      }),
  });
  const onSubmit: SubmitHandler<AddPostSchema> = async (
    inputs: AddPostSchema
  ) => {
    try {
      const images = inputs.images
        ? await startUpload(inputs.images).then((res) => {
            const formattedImages = res?.map((image) => ({
              id: image.key,
              url: image.url,
            }));
            return formattedImages ?? [];
          })
        : [];

      await addPostMutation.mutateAsync({
        caption: inputs.caption,
        images: images,
      });

      form.reset();
      setFiles(null);
    } catch (err) {
      //  eslint-disable@typescript-eslint/no-explicit-any
      // eslint-disable@typescript-eslint/no-unsafe-member-access
      customToastError((err as any).message);
    } finally {
      manualDialogClose();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button id="createPostButton" className="mb-2" variant={'secondary'}>
          <Icons.imagePlus className="h-4 w-4 mr-2 " /> New!
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-gray-300">
            Share some new Photos!
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      {...form.register('caption')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Adding a caption is optional.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Images</FormLabel>
              {!isUploading && previews?.length ? (
                <div className="flex items-center gap-2">
                  {previews.map((file) => (
                    <Zoom key={file.name}>
                      <Image
                        src={file.preview}
                        alt={file.name}
                        className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  ))}
                </div>
              ) : null}
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="images"
                  maxFiles={3}
                  maxSize={1024 * 1024 * 16}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={addPostMutation.isLoading || isUploading}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.images?.message}
              />
            </FormItem>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                disabled={addPostMutation.isLoading || isUploading}
                className="m-2 w-full"
              >
                {addPostMutation.isLoading && (
                  <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                )}
                {addPostMutation.isLoading ? (
                  <p>Saving your Post</p>
                ) : (
                  <p>Add Post</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
