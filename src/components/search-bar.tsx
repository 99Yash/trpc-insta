'use client';

import { Users } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

import { api } from '@/lib/api/api';
import { useOnClickOutside } from '@/lib/hooks/use-on-click-outside';
import debounce from 'lodash.debounce';
import { usePathname, useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setSearchInput(``);
  }, [pathname]);

  const {
    data: users,
    isFetched,
    refetch,
  } = api.user.search.useQuery(searchInput, {
    enabled: searchInput.length > 0,
  });

  const request = debounce(async () => {
    await refetch();
  }, 200);

  const debounceReq = useCallback(() => {
    request();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useOnClickOutside(commandRef, () => {
    setSearchInput(``);
  });
  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg max-w-md z-50 overflow-visible "
    >
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0 "
        placeholder="Search users by name or username..."
        value={searchInput}
        onValueChange={(value) => {
          setSearchInput(value);
          debounceReq();
        }}
      />

      {searchInput.length > 0 ? (
        <CommandList className="absolute top-full inset-x-0 shadow rounded-b-md bg-black ">
          {isFetched && users?.length === 0 && (
            <CommandEmpty>No users found.</CommandEmpty>
          )}
          {(users?.length ?? 0) > 0 ? (
            <CommandGroup heading="Users">
              {users?.map((user) => (
                <CommandItem
                  className="cursor-pointer"
                  value={user.name ?? user.username ?? ''}
                  key={user.id}
                  onSelect={(e) => {
                    router.push(`/${user.username}`);
                    router.refresh();
                  }}
                >
                  <Users className="mr-2 h-4 w-4 " />
                  <span className="">{user.name ?? user.username}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
