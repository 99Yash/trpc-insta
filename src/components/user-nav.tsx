'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { inter } from '@/styles/fonts';
import { Loader2, LogOut, UserIcon } from 'lucide-react';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useState } from 'react';

interface UserButtonProps {
  user: Pick<User, 'name' | 'image' | 'username' | 'email'>;
}

export const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true); // Set the loading state
      await signOut();
    } catch (error) {
      console.error('Error signing out', error);
    } finally {
      setIsSigningOut(false); // Reset the loading state
    }
  };
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="border-none opacity-70 focus-within:border-none hover:cursor-pointer focus:border-none"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image as string} />
            <AvatarFallback>{`${user.name?.split(' ')[0]![0]}${
              user.name?.split(' ')[1] ? user.name?.split(' ')[1]![0] : ''
            }`}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={` ${inter.className} `} align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user?.name && <p className="font-medium">{user.name}</p>}

              {user?.email && (
                <p className="w-[200px] truncate text-sm font-medium text-gray-500">
                  {user?.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />

          {/* //?  user profile */}
          <DropdownMenuItem
            // add route for showing profile page
            onClick={() => void router.push(`/${user.username}`)}
            className="cursor-pointer"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span className="font-normal text-gray-300">
              {/* user's first name -- profile */}
              {user?.name?.split(' ')[0]}&apos;s Profile
            </span>
            <DropdownMenuShortcut className="font-semibold">
              ⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {/* //todo add create a post */}

          {/* <DropdownMenuSeparator /> */}
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer mt-2">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-normal text-gray-300">Log out</span>
              <DropdownMenuShortcut className="font-semibold">
                ⇧⌘Q
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {/*//? dialog for logging out */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-300">You sure?</DialogTitle>
          <DialogDescription>
            Are you absolutely sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleSignOut} disabled={isSigningOut} type="submit">
            {/* //? if signing out, show spinner */}
            {isSigningOut ? <Loader2 className="h-4 w-4 mr-2" /> : null}
            {isSigningOut ? <p>Logging out...</p> : <p>Log out</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
