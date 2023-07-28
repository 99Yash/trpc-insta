'use client';

import { FileDialog } from '@/components/file-dialog';
import { api } from '@/lib/api/client';
import { customToastError, manualDialogClose } from '@/lib/utils';
import { addPostSchema } from '@/lib/validators';
import { OurFileRouter } from '@/server/uploadthing';
import { FileWithPreview } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { isArrayOfFile } from '../../lib/utils';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { toast } from '../ui/use-toast';
import { Zoom } from '../zoom-image';

type Inputs = z.infer<typeof addPostSchema>;
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const CreatePost = () => {
  const [files, setFiles] = useState<FileWithPreview[] | null>(null);

  const { isUploading, startUpload } = useUploadThing('imageUploader');
  const [isPending, startTransition] = useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(addPostSchema),
  });

  const previews = form.watch('images') as FileWithPreview[] | null;

  const addPostMutation = api.example.addPost.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your post has been created',
        variant: 'default',
        duration: 1200,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to post',
        variant: 'destructive',
        duration: 2000,
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    console.log('submitting form', form.getValues());
    startTransition(async () => {
      try {
        //?check if its a file & let uploadThing do its thing.
        //!error here
        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.fileKey,
                url: image.fileUrl,
              }));
              return formattedImages ?? null;
            })
          : null;

        await addPostMutation.mutateAsync({
          caption: data.caption,
          images: images,
        });
        manualDialogClose();
        form.reset();
        setFiles(null);
      } catch (err) {
        customToastError(err);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-2" variant={'secondary'}>
          <ImagePlus className="h-4 w-4 mr-2" /> Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-gray-300">
            Share something new!
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={() => onSubmit(form.getValues())}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a caption here (optional)"
                      {...form.register('caption')}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
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
                            width={230}
                            height={230}
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
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full text-black"
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Create Post
              <span className="sr-only">Create Post</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
