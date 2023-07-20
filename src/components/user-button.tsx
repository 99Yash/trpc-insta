'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { inter } from '@/styles/fonts';
import { RedirectToUserProfile, useClerk } from '@clerk/nextjs';
import { LogOut, PlusCircle, Settings, Settings2, User } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';

export const UserButton = () => {
  const { user, signOut } = useClerk();
  const router = useRouter();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="border-none focus-within:border-none hover:cursor-pointer focus:border-none"
        >
          {user?.profileImageUrl ? (
            <Avatar>
              <AvatarImage
                className="h-10 w-10"
                src={user?.imageUrl}
                alt={user?.firstName || 'You'}
              />
            </Avatar>
          ) : (
            <Skeleton className="h-10 w-10 rounded-full " />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className={` ${inter.className} `} align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user?.fullName && <p className="font-medium">{user.fullName}</p>}
              {user?.primaryEmailAddress && (
                <p className="w-[200px] truncate text-sm font-medium text-gray-500">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => void router.push(`/user/${user?.id}`)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="font-normal text-gray-300">View Profile</span>
            <DropdownMenuShortcut className="font-black">
              ⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            //todo add onClick
            className="cursor-pointer"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="font-normal text-gray-300">Create New Post</span>
            <DropdownMenuShortcut className="font-black">
              ⌘N
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => void router.push(`/user/settings`)}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="text-gray-300 font-normal">Your Account</span>
            <DropdownMenuShortcut className="font-black">
              ⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer mt-2">
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-normal text-gray-300">Log out</span>
              <DropdownMenuShortcut className="font-black">
                ⇧⌘Q
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-gray-300">You sure?</DialogTitle>
          <DialogDescription>
            Are you absolutely sure you want to log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              signOut();
            }}
            type="submit"
          >
            Log out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
