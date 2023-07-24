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
import { LogOut, Settings, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage } from './ui/avatar';
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
import { Skeleton } from './ui/skeleton';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';

interface UserButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, 'name' | 'image' | 'email'>;
}

export const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="border-none focus-within:border-none hover:cursor-pointer focus:border-none"
        >
          {user?.image ? (
            <Avatar>
              <AvatarImage
                className="h-10 w-10"
                src={user?.image}
                alt={user?.name?.split(' ')[0] || 'You'}
              />
            </Avatar>
          ) : (
            <Skeleton className="h-10 w-10 rounded-full " />
          )}
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
          <DropdownMenuItem
            onClick={() => void router.push(`/`)}
            className="cursor-pointer"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span className="font-normal text-gray-300">
              {user?.name?.split(' ')[0]}&apos;s Profile
            </span>
            <DropdownMenuShortcut className="font-semibold">
              ⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {/* //todo add create a post */}
          <DropdownMenuItem
            onClick={() => void router.push(`/user/settings`)}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="text-gray-300 font-normal">Your Account</span>
            <DropdownMenuShortcut className="font-semibold">
              ⇧⌘A
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
