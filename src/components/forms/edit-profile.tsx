'use client';
import { userPublicMetadataSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Settings2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { api } from '@/lib/api/api';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

type UsernameBioMetadata = z.infer<typeof userPublicMetadataSchema>;

const EditProfile = ({ username, bio }: { username: string; bio: string }) => {
  const defaultValues: UsernameBioMetadata = {
    username,
    bio,
  };
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UsernameBioMetadata>({
    resolver: zodResolver(userPublicMetadataSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { mutate, isLoading } = api.example.updateMetadata.useMutation({
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

  const onSubmit = (inputs: UsernameBioMetadata) => {
    mutate({
      ...inputs,
    });
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-2" variant={'secondary'}>
          <Settings2Icon className="h-4 w-4 mr-2" /> Edit
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
                  <FormDescription>
                    Your public display name. It can be your real name or a
                    pseudonym.
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
                  <FormDescription>
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
                variant="secondary"
                disabled={isLoading}
                className="m-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
