import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

const loading = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="min-h-9/10 flex flex-col md:flex-row md:items-start sm:justify-center sm:items-center md:justify-evenly gap-4">
        <div className="flex self-start gap-4">
          <Skeleton className="md:h-36 md:w-36 h-20 w-20 border border-slate-950 mb-5 rounded-full "></Skeleton>
          <div className="md:hidden flex flex-col ">
            <div className="flex flex-col gap-3 ">
              <Skeleton className="h-4 w-[12px]" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:hidden gap-2">
          <Skeleton className="h-4 self-start w-[370px]" />
          <Skeleton className="text-sm self-start h-6 w-[500px]" />
          <hr className="border-0 h-[1px] mt-2 bg-gradient-to-r from-gray-900 via-slate-500 to-gray-900" />
          {/* //? row of numbers(posts, following, followers) */}
          <div className="grid grid-cols-3 justify-evenly">
            <div className="flex flex-col items-center ">
              <Skeleton className=" h-6 w-20 " />
              <Skeleton className="h-4 w-12 " />
            </div>

            <div className="flex flex-col items-center ">
              <Skeleton className="h-6 w-20 " />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="flex flex-col items-center ">
              <Skeleton className="h-6 w-20 " />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <hr className="border-0 h-px mt-2 bg-gradient-to-r from-gray-900 via-slate-500 to-gray-900" />
        </div>
        <div className="hidden md:flex md:w-1/2 md:flex-col gap-4">
          <div className="flex md:flex-row gap-10 items-baseline">
            <Skeleton className="h-4 w-12" />
            <div className="flex gap-2 justify-end ">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
          <div className="flex gap-8 items-center ">
            <div className="flex gap-2 justify-center items-center  ">
              <Skeleton className="h-4 w-4 " />
              <Skeleton className="h-4 w-12 "></Skeleton>
            </div>
            <div className="flex gap-2 justify-center items-center ">
              <Skeleton className="h-4 w-4"></Skeleton>
              <Skeleton className="h-6 w-20 "></Skeleton>
            </div>
            <div className="flex gap-2 justify-center items-center  ">
              <Skeleton className="h-4 w-4"></Skeleton>
              <Skeleton className="h-6 w-20 "></Skeleton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-12"></Skeleton>
            <Skeleton className="h-4 w-12 "></Skeleton>
          </div>
        </div>
      </div>
      <hr className="border-0 hidden md:block h-px mt-2 bg-slate-700" />
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="relative pb-[100%]">
            <Skeleton className="absolute inset-0 h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default loading;
