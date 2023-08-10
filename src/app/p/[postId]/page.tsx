import AddComment from '@/components/forms/add-comment';
import CustomAvatar from '@/components/utilities/custom-avatar';
import PostButtons from '@/components/utilities/post-buttons';
import { getCurrentUser } from '@/lib/session';
import { formatTimeToNow } from '@/lib/utils';
import { prisma } from '@/server/db';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type PostIdPageProps = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({
  params,
}: PostIdPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: {
      id: params.postId,
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  if (!post) notFound();
  return {
    title: `${post.caption} • @${post.user.username}`,
    description: post.caption,
    openGraph: {
      title: `
      ${post.user.name} (@${post.user.username}) • Trinsta.
      `,
      description: post.caption ? post.caption : '',
      images: [
        {
          url: post.user.image as string,
        },
      ],
    },
  };
}

const PostPage = async ({ params }: PostIdPageProps) => {
  const { postId } = params;
  const user = await getCurrentUser().catch((err) => {
    console.error(err.message);
    return null;
  });

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              username: true,
              image: true,
              name: true,
            },
          },
        },
      },
      likes: true,
      images: true,
      user: {
        select: {
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!post) notFound();

  return (
    <div className="flex border border-gray-800 flex-col md:items-center md:h-[62vh] md:w-[100vw] lg:w-[90vw] xl:w-[80vw] md:gap-6 gap-3 h-[50vh] mb-2 ">
      {/* //? mobile header user info */}
      <div className="flex md:hidden items-center flex-wrap gap-1 ">
        <CustomAvatar
          imgUrl={post.user.image as string}
          name={post.user.name as string}
        />
        <p className="text-xs inline-block font-semibold">
          {post?.user.username}
        </p>
        <p className="text-sm text-gray-400">
          {formatTimeToNow(post.createdAt)}
        </p>
      </div>
      <div className="flex md:hidden">
        <Image
          src={post.images[0]?.url as string}
          className="block w-screen md:hidden"
          alt={`${post.caption} • @${post.user.username}`}
          width={450}
          height={450}
        />
      </div>
      {/* //? this includes no. of likes */}
      <div className="flex md:hidden">
        <PostButtons post={post} />
      </div>
      <div className="md:flex self-start hidden md:bg-black gap-3 h-full w-full ">
        <Image
          src={post.images[0]?.url as string}
          width={650}
          height={650}
          alt={`${post.caption} • @${post.user.username}`}
          className="h-full object-cover md:block hidden"
        />
        <hr className="border-0 hidden md:block w-px h-full bg-slate-700" />
        <div className="md:flex h-full hidden flex-col py-2 flex-grow">
          {/* //? post author header */}
          <div className="flex items-center gap-2">
            <CustomAvatar
              imgUrl={post.user.image as string}
              name={post.user.name as string}
            />
            <p className="text-sm font-semibold">{post.user.username}</p>
          </div>
          <hr className="border-0 w-full h-px mt-2 bg-slate-700" />
          {/* //? post author caption */}
          <div className="flex flex-wrap items-center gap-1 mt-2 pb-4 ">
            <CustomAvatar
              imgUrl={post.user.image as string}
              name={post.user.name as string}
            />
            <p className="text-xs inline-block font-semibold">
              {post?.user.username}
            </p>
            <p className="text-sm text-gray-400">
              {formatTimeToNow(post.createdAt)}
            </p>
            <p className="text-sm">{post?.caption}</p>
          </div>
          {/* //?comments */}
          <div className="overflow-y-auto scrollbar-hide h-4/5 ">
            {post.comments.length > 0 &&
              post.comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="flex flex-wrap items-center gap-1 mt-2 "
                >
                  <CustomAvatar
                    imgUrl={cmt.user.image as string}
                    name={cmt.user.name as string}
                  />
                  <p className="text-xs inline-block font-semibold">
                    {cmt?.user.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatTimeToNow(cmt.createdAt)}
                  </p>
                  <p className="text-sm">{cmt?.text}</p>
                </div>
              ))}
          </div>
          <hr className="border-0 w-full h-px bg-slate-700" />
          <div className="py-3 flex flex-col gap-2 ">
            {user ? (
              <PostButtons userId={user.id} post={post} />
            ) : (
              <PostButtons post={post} />
            )}
            <p className=" text-sm text-gray-500">
              {formatTimeToNow(post.createdAt)} ago
            </p>
          </div>
          <div className="flex gap-2">
            {/* //! dont remove this div */}
            {/* //? add a comment input */}
            {user ? (
              <CustomAvatar
                imgUrl={user.image as string}
                name={user.name ?? ''}
              />
            ) : null}
            <AddComment postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
