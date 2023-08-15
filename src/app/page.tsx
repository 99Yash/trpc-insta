import AddComment from '@/components/forms/add-comment';
import { Skeleton } from '@/components/ui/skeleton';
import CustomAvatar from '@/components/utilities/custom-avatar';
import PostButtons from '@/components/utilities/post-buttons';
import { getCurrentUser } from '@/lib/session';
import { formatTimeToNow } from '@/lib/utils';
import { prisma } from '@/server/db';
import Image from 'next/image';

interface PostProps {
  post: {
    id: string;
    user: {
      image: string | null;
      name: string | null;
      username: string | null;
    };
    comments: Array<{ id: string }>;
    likes: Array<{ userId: string }>;
    images: Array<{ url: string }>;
    caption: string | null;
    createdAt: Date;
  };
  userId?: string;
}

const Post = async ({ post, userId }: PostProps) => {
  return (
    <div key={post.id} className="flex flex-col gap-3 ">
      <div className="flex items-center gap-2">
        <CustomAvatar
          imgUrl={post.user.image as string}
          name={post?.user.name as string}
        />
        <p className="text-sm font-semibold">{post?.user.username}</p>
        <p className="text-sm text-gray-400">
          • {formatTimeToNow(post.createdAt)}
        </p>
      </div>
      <Image
        src={post.images[0]?.url as string}
        alt={post.caption || 'Cant preview image'}
        width={740}
        height={740}
        className="border sm:w-screen md:w-full border-slate-700 "
      />
      <PostButtons userId={userId} postId={post.id} />
      <div className="flex flex-wrap items-baseline gap-1 ">
        <p className="text-xs inline-block font-semibold">
          {post?.user.username}
        </p>
        <p className="text-sm">{post?.caption}</p>
      </div>
      {post.comments && post.comments.length > 0 ? (
        <span className="text-gray-500">
          View {post.comments && post.comments.length > 2 ? 'all' : null}{' '}
          {post.comments?.length}{' '}
          {post.comments && post.comments.length > 1 ? 'comments' : 'comment'}{' '}
        </span>
      ) : null}
      <div className="flex">
        {/* //! dont remove this div */}
        {/* //? add a comment input */}
        <AddComment postId={post.id} />
      </div>
      <hr className="border-0 hidden md:block w-full h-px mt-2 bg-slate-700 " />
    </div>
  );
};

export default async function Index() {
  const user = await getCurrentUser();
  if (!user) {
    const randomPosts = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
        likes: {
          select: {
            userId: true,
          },
        },
        user: true,
        comments: {
          select: {
            id: true,
          },
        },
      },
    });
    return (
      <div className="flex flex-col items-center gap-6 mb-2">
        {randomPosts.map((post, idx) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    );
  }

  //todo: if user has no posts  & follows no one, show random posts.
  const feedPosts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true,
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
      user: {
        select: {
          username: true,
          image: true,
          name: true,
        },
      },
    },
    take: 5,
  });

  //?skeleton
  if (!feedPosts) {
    return (
      <div className="flex flex-col items-center gap-6 mb-2">
        <div className="flex items-center ">
          <Skeleton className="rounded-full self-center h-8 w-8 " />
          <Skeleton className="h-6 w-20 " />
        </div>
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="flex flex-wrap items-center gap-1 px-2">
          <Skeleton className="h-6 w-20"></Skeleton>
          <Skeleton className="h-6 w-60"></Skeleton>
        </div>
        <hr className="border-0 hidden md:block h-px mt-2 bg-slate-700" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 mb-2 ">
      {feedPosts.map((post) => (
        <Post userId={user.id} post={post} key={post.id} />
      ))}
    </div>
  );
}
