'use client';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { customToastError, manualDialogClose } from '@/lib/utils';
import type { imageFileSchema } from '@/lib/validators';
import { imageSchema } from '@/lib/validators'
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import CustomAvatar from './custom-avatar';

type ImageFileSchema = z.infer<typeof imageFileSchema>;

const EditProfilePhoto = ({
  photoUrl,
  name, //? for fallback img
}: {
  photoUrl: string;
  name?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiCtx = api.useUtils();

  const { useUploadThing } = generateReactHelpers<OurFileRouter>()
  const { isUploading, startUpload } = useUploadThing('profilePicUploader');

  const handleButtonClick = () => {
    //? Programmatically trigger the file input click event
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const form = useForm<ImageFileSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: null,
    },
    mode: 'onChange',
  });

  const changePictureMutation = api.user.changeProfilePic.useMutation({
    onSuccess: async () => {
      await apiCtx.user.fetchUser.invalidate();
      toast({
        description: 'Your photo has been updated',
        variant: 'default',
        duration: 1300,
      });
    },
    onError: (err) =>
      toast({
        title: 'Could not change picture.',
        description: err.message,
        variant: 'destructive',
        duration: 900,
      }),
  });

  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      //? Check if the selected file is an image
      try {
        const profilePic = await startUpload([selectedFile]).then((res) => {
          const formattedImage = res?.map((img) => ({
            url: img.url,
            id: img.key,
          }));
          return formattedImage?.at(0);
        });
        await changePictureMutation.mutateAsync({
          id: profilePic!.id,
          url: profilePic!.url,
        });
        // const oldPicUrl = new URL(photoUrl);
        // if (oldPicUrl.hostname === 'uploadthing.com'||'utfs.io') {

        // }

        form.reset();
      } catch (err) {
        customToastError(err);
      } finally {
        manualDialogClose();
      }
    } else {
      alert('Please only select an image file.');
    }
  };

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant="link">Change photo</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[475px]">
        <DialogHeader className="flex flex-col justify-center items-center gap-2">
          <CustomAvatar imgUrl={photoUrl} name={name ?? ''} />
          <div className="flex flex-col justify-center items-center gap-1 ">
            <h3 className="dark:text-gray-300 text-lg font-medium">
              Synced Profile Picture
            </h3>
            <p className="text-sm text-gray-500 font-normal">Trinsta Corp.</p>
          </div>
        </DialogHeader>
        <Form {...form}>
          <Input
            ref={fileInputRef}
            onChange={handleFileInputChange}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
          />
          <Button
            type="submit"
            disabled={isUploading || changePictureMutation.isLoading}
            onClick={handleButtonClick}
            variant={'link'}
          >
            {changePictureMutation.isLoading && (
              <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
            )}
            Upload Photo
            <span className="text-xs text-gray-500">&nbsp;(max. 8MB)</span>
          </Button>
          <Button
            onClick={manualDialogClose}
            disabled={isUploading || changePictureMutation.isLoading}
            variant={'link'}
          >
            <span className="text-gray-400">Cancel</span>
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfilePhoto;
