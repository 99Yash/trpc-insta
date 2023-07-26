'use client';
import { api } from '@/lib/api/api';
import { userPublicMetadataSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Settings2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

type UsernameBioMetadata = z.infer<typeof userPublicMetadataSchema>;

const EditProfile = ({ username, bio }: { username: string; bio: string }) => {
  const defaultValues: UsernameBioMetadata = {
    username,
    bio,
  };
  const { toast } = useToast();
  const router = useRouter();
  const apiCtx = api.useContext();

  const form = useForm<UsernameBioMetadata>({
    resolver: zodResolver(userPublicMetadataSchema),
    defaultValues,
    mode: 'onChange',
  });
  const watchingUsername = form.watch('username');

  const updateProfileMutation = api.example.updateUsernameBio.useMutation({
    onSuccess: async () => {
      //! fix invalidate user error.
      await apiCtx.example.fetchUser.invalidate();

      toast({
        title: 'Profile updated',
        description: 'Your profile data has been updated',
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

  const onSubmit: SubmitHandler<UsernameBioMetadata> = async (
    inputs: UsernameBioMetadata
  ) => {
    await updateProfileMutation.mutateAsync({
      username: inputs.username,
      bio: inputs.bio ? inputs.bio : '',
    });
    if (username === watchingUsername) {
      return;
    } else {
      router.push(`/${inputs.username}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-2" variant={'secondary'}>
          <Settings2Icon className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-gray-300">Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register('username')}
                      placeholder={username}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Your public display name. Changing this will reload this
                    page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...form.register('bio')}
                      placeholder={
                        bio.length > 0
                          ? bio
                          : 'Tell us a little bit about yourself'
                      }
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    This is your bio. It will be visible to everyone who visits
                    your page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                disabled={updateProfileMutation.isLoading}
                className="m-2"
              >
                {updateProfileMutation.isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
