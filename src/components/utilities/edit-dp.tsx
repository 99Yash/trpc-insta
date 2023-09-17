'use client';
import { api } from '@/lib/api/api';
import { customToastError, manualDialogClose } from '@/lib/utils';
import { imageFileSchema, imageSchema } from '@/lib/validators';
import { useUploadThing } from '@/utils/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  name,
}: {
  photoUrl: string;
  name?: string | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiCtx = api.useContext();

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
            url: img?.fileUrl,
            id: img?.fileKey,
          }));
          return formattedImage?.at(0);
        });
        await changePictureMutation.mutateAsync({
          id: profilePic!.id,
          url: profilePic!.url,
        });
        const oldPicUrl = new URL(photoUrl);
        if (oldPicUrl.hostname === 'uploadthing.com') {
        }
        form.reset();
      } catch (err) {
        customToastError(err);
      } finally {
        manualDialogClose();
      }
      // Do something with the selected image file (e.g., upload to server)
    } else {
      // Handle the case where the selected file is not an image
      alert('Please select an image file.');
    }
    //todo Do something with the selected file (e.g., upload to server)
  };

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant="link">Change profile photo</Button>
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
