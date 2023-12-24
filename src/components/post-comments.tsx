'use client';

import { api } from '@/trpc/react';
import { formatTimeToNow } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import CustomAvatar from './utilities/custom-avatar';

const CommentSkeleton = () => {
  return (
    <div className="flex items-center gap-1 mt-2">
      <Skeleton className="rounded-full w-10 h-10" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {/* //?comment and its author */}
          <div className="flex items-center gap-2">
            <Skeleton className="text-sm inline-flex shrink-0 w-12 font-semibold hover:text-gray-400 mr-2 cursor-pointer" />
          </div>
        </div>
        <Skeleton className="text-xs w-40 h-8 text-gray-500 " />
      </div>
    </div>
  );
};

const PostComments = ({ postId }: { postId: string }) => {
  const { data: comments } = api.comment.fetchCommentsOfPost.useQuery({
    postId,
  });
  return (
    <>
      {!comments &&
        Array.from({ length: 5 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      {comments?.map((cmt) => (
        <div key={cmt.id} className="flex gap-1 mt-2">
          <CustomAvatar
            imgUrl={cmt.user.image}
            name={cmt.user.name}
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {/* //?comment and its author */}
              <div className="flex">
                <div className=" text-xs md:text-sm whitespace-pre-line overflow-hidden text-ellipsis ">
                  <Link
                    href={`/${cmt.user.username}`}
                    className=" text-xs md:text-sm inline-flex shrink-0 font-semibold hover:text-gray-400 mr-2 cursor-pointer"
                  >
                    {cmt.user.username}
                  </Link>
                  {cmt.text}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 ">
              {formatTimeToNow(cmt.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostComments;
