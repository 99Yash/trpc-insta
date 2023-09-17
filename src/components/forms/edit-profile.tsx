'use client';
import { api } from '@/lib/api/api';
import { customToastError, manualDialogClose } from '@/lib/utils';
import { userProfileSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
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

type UsernameBioMetadata = z.infer<typeof userProfileSchema>;

const EditProfile = ({
  username,
  bio,
  name,
}: {
  username: string;
  name: string;
  bio: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const apiCtx = api.useContext();

  const { data: user } = api.user.fetchUser.useQuery({ username });
  const defaultValues: UsernameBioMetadata = {
    username,
    bio,
    name,
  };

  const form = useForm<UsernameBioMetadata>({
    resolver: zodResolver(userProfileSchema),
    defaultValues,
    mode: 'onChange',
  });
  const watchingUsername = form.watch('username');

  const updateProfileMutation = api.user.updateUserProfile.useMutation({
    onSuccess: async () => {
      await apiCtx.user.fetchUser.invalidate();
      toast({
        title: 'Profile updated',
        description: 'Profile updated with latest credentials.',
        variant: 'default',
        duration: 1300,
      });
    },
    onError: (err) =>
      toast({
        title: 'Uh oh..',
        description: err.message,
        variant: 'destructive',
        duration: 1300,
      }),
  });

  const onSubmit: SubmitHandler<UsernameBioMetadata> = async (
    inputs: UsernameBioMetadata
  ) => {
    try {
      await updateProfileMutation.mutateAsync({
        username: inputs.username,
        bio: inputs.bio ? inputs.bio : '',
        name: inputs.name,
      });
      if (username === watchingUsername) {
        return;
      } else {
        router.push(`/${inputs.username}`);
      }
    } catch (err: any) {
      customToastError(err);
    } finally {
      manualDialogClose();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-2" variant={'secondary'}>
          <Icons.settings className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle className="text-gray-300">Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Bio</FormLabel>
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
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register('name')}
                      placeholder={name}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    This is your public display name. It will be visible to
                    everyone who visits your page. Cannot be empty.
                  </FormDescription>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...form.register('username')}
                      placeholder={username}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=" flex gap-2 items-center text-yellow-600">
                    <Icons.alertTriangle className="h-4 w-4 " />
                    Your username. Changing this will reload this page.
                  </FormDescription>
                  <FormMessage className="text-red-300" />
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
                  <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
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
