import { getCurrentUser } from '@/lib/session';
import { formatTimeToNow } from '@/lib/utils';
import { prisma } from '@/server/db';
import { notFound } from 'next/navigation';
import AddComment from './forms/add-comment';
import CustomAvatar from './utilities/custom-avatar';
import PostButtons from './utilities/post-buttons';
import PostImage from './utilities/post-image';
import Link from 'next/link';

//? the contents of the post modal
const PostModal = async ({ postId }: { postId: string }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        include: {
          user: {
            select: {
              username: true,
              name: true, //? for fallback image
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      images: true,
      likes: true,
      user: {
        select: {
          name: true, //? for rendering fallback image
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
      <PostImage imageUrl={post.images[0]?.url as string} postId={post.id} />

      {/* //?right side */}
      {/* //todo hide this on smaller screens */}
      <div className="flex flex-grow flex-col h-[90vh] w-[45vw] bg-black items-stretch">
        {/* //? header -- user info */}
        <div className="flex pl-4 pt-2 gap-2 h-[10%] items-center">
          <CustomAvatar
            imgUrl={post.user.image as string}
            name={post.user.name as string}
          />
          {/* //todo make the user pic and the username clickable, push to the profile of user. greyed on hover */}
          <p className="text-sm">{post?.user.username}</p>
        </div>
        <hr className="border-0 block w-full h-px mr-4 bg-slate-700" />
        {/* //? comments section */}
        <div className="flex flex-col justify-between h-[85%] gap-2 w-full pl-4 ">
          {/* //? first: user's caption ,if any */}
          <div className="flex mt-3">
            {/* //todo replace post user with comment author */}
            <CustomAvatar
              imgUrl={post.user.image as string}
              name={post.user.name as string}
            />
            {/* //? user caption */}
            <div className="flex gap-1 pt-2 flex-wrap ">
              <p className="text-sm font-semibold flex-none hover:text-gray-400 cursor-pointer">
                {post?.user.username}
              </p>
              <p className="text-sm whitespace-pre-line flex-grow ">
                {post?.caption}
              </p>
            </div>
          </div>
          {/* //? comments */}
          <div className="flex-grow flex flex-col gap-4 scrollbar-hide overflow-auto">
            {post.comments.map((cmt) => (
              <div key={cmt.id} className="flex gap-1 mt-2">
                <CustomAvatar
                  imgUrl={cmt.user.image as string}
                  name={cmt.user.name as string}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex">
                      <div className="text-sm whitespace-pre-line overflow-hidden text-ellipsis ">
                        <Link
                          href={`/${cmt.user.username}`}
                          className="text-sm inline-flex shrink-0 font-semibold hover:text-gray-400 mr-2 cursor-pointer"
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
          </div>

          <hr className="border-0 block w-full h-px mr-4 bg-slate-700" />
          <div className="flex flex-col h-[20%] gap-4 ">
            {/* //? button group */}
            <div className="flex gap-2  ">
              <PostButtons postId={post.id} userId={user?.id} />
              <p className="text-xs pt-2 text-gray-400 ">
                • {formatTimeToNow(post.createdAt)}
              </p>
            </div>

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
    </div>
  );
};

export default PostModal;
