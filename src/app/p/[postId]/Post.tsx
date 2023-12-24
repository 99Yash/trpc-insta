'use client';

import AddComment from '@/components/forms/add-comment';
import PostComments from '@/components/post-comments';
import CustomAvatar from '@/components/utilities/custom-avatar';
import PostActions from '@/components/utilities/post-actions';
import PostButtons from '@/components/utilities/post-buttons';
import PostImage from '@/components/utilities/post-image';
import { api } from '@/trpc/react';
import { formatTimeToNow } from '@/lib/utils';
import Link from 'next/link';

export default function Post({ postId }: { postId: string }) {
  const { data: user } = api.user.fetchCurrentUser.useQuery();
  const { data: post } = api.post.fetchPost.useQuery({ postId });
  //? don't return notFound() in a client component
  if (!post) return null;
  return (
    <div className="flex mt-6 md:mt-0 md:border border-gray-800 flex-col md:items-center md:w-[95vw] 2xl:w-[80vw] gap-3 h-fit mb-2 ml-32">
      {/* //? mobile header user info */}
      <div className="flex md:hidden items-center flex-wrap gap-1 ">
        <CustomAvatar
          imgUrl={post.user.image}
          name={post.user.name}
        />
        <p className="text-xs inline-block font-semibold">
          {post.user.username}
        </p>
        <p className="text-sm text-gray-400">
          {formatTimeToNow(post.createdAt)}
        </p>
      </div>
      <div className="md:hidden">
        <PostImage
          imageUrls={post.images.map((i) => i.url!)}
          postId={post.id}
        />
      </div>
      <div className="flex flex-col gap-3 md:hidden">
        <PostButtons postId={postId} />
        <div className="flex gap-1">
          <CustomAvatar
            imgUrl={user?.image!}
            name={user?.name!}
          />
          <AddComment postId={postId} />
        </div>
        <PostComments postId={postId} />
      </div>
      {/* //? this is for non mobile */}
      <div className="md:flex hidden bg-black h-full w-full ">
        <PostImage
          imageUrls={post.images.map((i) => i.url!)}
          postId={postId}
        />
        <div className="flex flex-col py-2 ml-2 w-[45%]">
          {/* //? post author header */}
          <div className="flex items-center gap-2">
            <CustomAvatar
              imgUrl={post.user.image!}
              name={post.user.name!}
            />
            <Link
              href={`/${post.user.username}`}
              className="text-sm font-semibold hover:text-gray-400 duration-150"
            >
              {post.user.username}
            </Link>
            <p className=" text-sm text-gray-500">
              {formatTimeToNow(post.createdAt)}
            </p>
            {user?.id === post.userId && <PostActions postId={post.id} />}
          </div>
          <hr className="border-0 w-full h-px mt-2 bg-slate-700" />
          {/* //? post author caption */}
          <div className="flex items-center gap-1 mt-2 pb-4 ">
            <CustomAvatar
              imgUrl={post.user.image!}
              name={post.user.name!}
            />
            <div className="flex pt-2">
              <div className="whitespace-pre-line overflow-hidden text-sm text-ellipsis">
                <Link
                  href={`/${post.user.username}`}
                  className="inline-block font-semibold mr-2 hover:text-gray-400 duration-150"
                >
                  {post?.user.username}
                </Link>
                {post?.caption}
              </div>
            </div>
          </div>
          {/* //?comments */}
          <div className="overflow-y-auto scrollbar-hide h-full">
            <PostComments postId={postId} />
          </div>
          <hr className="border-0 w-full h-px bg-slate-700" />
          <div className="py-3 flex flex-col gap-2 ">
            <PostButtons postId={postId} />
          </div>
          <div className="flex gap-2">
            {/* //! dont remove this div */}
            {/* //? add a comment input */}
            {user ? (
              <CustomAvatar
                imgUrl={user.image!}
                name={user.name ?? ''}
              />
            ) : null}
            <AddComment postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
