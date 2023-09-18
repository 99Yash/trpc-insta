import { getCurrentUser } from '@/lib/session';
import { formatTimeToNow } from '@/lib/utils';
import { prisma } from '@/server/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddComment from './forms/add-comment';
import PostComments from './post-comments';
import CustomAvatar from './utilities/custom-avatar';
import PostActions from './utilities/post-actions';
import PostButtons from './utilities/post-buttons';
import PostImage from './utilities/post-image';

//? the contents of the post modal
//! Fix this view for phone
const PostModal = async ({ postId }: { postId: string }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        select: {
          id: true,
        },
      },
      images: true,
      likes: true,
      user: {
        select: {
          name: true,
          id: true, //? for rendering fallback image
          username: true,
          image: true,
        },
      },
    },
  });

  const user = await getCurrentUser();

  if (!post) notFound();

  return (
    <div className="flex max-h-[90vh] max-w-[80vw]">
      {/* //? image on the left and comments in right. at least on big devices */}
      <PostImage
        imageUrls={post.images.map((i) => i.url) as string[]}
        postId={post.id}
      />

      {/* //?right side */}
      {/* //todo hide this on smaller screens */}
      <div className="flex flex-grow flex-col h-[90vh] w-[45vw] bg-black items-stretch ml-2">
        {/* //? header -- user info */}
        <div className="flex pl-4 pt-2 gap-2 h-[10%] items-center w-full">
          <CustomAvatar
            imgUrl={post.user.image as string}
            name={post.user.name as string}
          />
          <Link href={`/${post.user.username}`} className="text-sm">
            {post?.user.username}
          </Link>
          <p className="text-gray-400">{formatTimeToNow(post.createdAt)}</p>
          {user?.id === post.user.id && <PostActions postId={postId} />}
        </div>
        <hr className="border-0 block w-full h-px mr-4 bg-slate-700" />
        {/* //? comments section */}
        <div className="flex  flex-col justify-between h-[85%] gap-2 w-full pl-4 scrollbar-hide overflow-auto">
          {/* //? first: user's caption ,if any */}
          <div className="flex flex-col justify-between  gap-2 w-full pl-4 ">
            <div className="flex mt-3">
              <CustomAvatar
                imgUrl={post.user.image as string}
                name={post.user.name as string}
              />
              {/* //? user caption */}
              <div className="flex pt-2">
                <div className="text-sm whitespace-pre-line overflow-hidden text-ellipsis">
                  <Link
                    href={`/${post.user.username}`}
                    className="text-sm inline-flex font-semibold mr-2 hover:text-gray-400 cursor-pointer"
                  >
                    {post?.user.username}
                  </Link>
                  {post?.caption}
                </div>
              </div>
            </div>
            {/* //? comments */}
            <div className="flex-grow flex flex-col gap-4 ">
              <PostComments postId={post.id} />
            </div>
          </div>
        </div>
        <hr className="border-0 block w-full h-px mb-4 bg-slate-700" />
        <div className="flex flex-col h-[20%] gap-4 ">
          {/* //? button group */}
          <PostButtons postId={post.id} />

          {/* //* comment form here */}
          <div className="flex gap-4">
            <CustomAvatar
              imgUrl={user?.image ?? null}
              name={user?.name ?? null}
            />
            <AddComment postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
