'use client';
import { api } from '@/lib/api/api';
import { customToastError, manualDialogClose } from '@/lib/utils';
import { addPostSchema } from '@/lib/validators';
import { FileWithPreview } from '@/types';
import { useUploadThing } from '@/utils/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FileDialog } from '../file-dialog';
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
import { z } from 'zod';

type AddPostSchema = z.infer<typeof addPostSchema>;

const CreatePost = () => {
  const defaultValues: AddPostSchema = {
    caption: '',
    images: null,
  };
  const { toast } = useToast();
  const apiCtx = api.useContext();
  const [files, setFiles] = useState<FileWithPreview[] | null>(null);

  const { isUploading, startUpload } = useUploadThing('postImageUploader');

  const form = useForm<AddPostSchema>({
    resolver: zodResolver(addPostSchema),
    defaultValues,
    mode: 'onChange',
  });

  const previews = form.watch('images') as FileWithPreview[] | null;

  const addPostMutation = api.example.addPost.useMutation({
    onSuccess: async () => {
      //! fix invalidate user error.
      await apiCtx.example.fetchUser.invalidate();
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
        duration: 8900,
      }),
  });
  const onSubmit: SubmitHandler<AddPostSchema> = async (
    inputs: AddPostSchema
  ) => {
    //todo if form is unmodified, stop. isDirty not working
    console.log(inputs);
    try {
      const images = inputs.images
        ? await startUpload(inputs.images).then((res) => {
            const formattedImages = res?.map((image) => ({
              id: image.fileKey,
              url: image.fileUrl,
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
    } catch (err: any) {
      customToastError(err);
    } finally {
      manualDialogClose();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button id="createPostButton" className="mb-2" variant={'secondary'}>
          <ImagePlus className="h-4 w-4 mr-2 " /> New Post
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
                disabled={addPostMutation.isLoading}
                className="m-2 w-full"
              >
                {addPostMutation.isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {addPostMutation.isLoading ? (
                  <p>Saving your Post</p>
                ) : (
                  <p>Save Changes</p>
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
