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
import { useClerk } from '@clerk/nextjs';
import { LogOut, PlusCircle, User } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export const UserButton = () => {
  const { user, signOut } = useClerk();
  const router = useRouter();

  return (
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
          onClick={() => void router.push(`/${user?.id}`)}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span className="font-normal text-gray-300">View Profile</span>
          <DropdownMenuShortcut className="font-black">⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          //todo onClick={() => void signOut()}
          className="cursor-pointer"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="font-normal text-gray-300">Create New Post</span>
          <DropdownMenuShortcut className="font-black">⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            signOut();
            router.push('/');
          }}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-normal text-gray-300">Log out</span>
          <DropdownMenuShortcut className="font-black">
            ⇧⌘Q
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
