import AddComment from '@/components/forms/add-comment';
import CustomAvatar from '@/components/utilities/custom-avatar';
import PostButtons from '@/components/utilities/post-buttons';
import PostImage from '@/components/utilities/post-image';
import { getCurrentUser } from '@/lib/session';
import { formatTimeToNow } from '@/lib/utils';
import { prisma } from '@/server/db';
import Image from 'next/image';
import Link from 'next/link';

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
    <div key={post.id} className="flex flex-col gap-3 container ">
      <div className="flex items-center gap-2">
        <CustomAvatar
          imgUrl={post.user.image as string}
          name={post?.user.name as string}
        />
        <Link
          href={`/${post.user.username}`}
          className="text-sm font-semibold hover:text-gray-400"
        >
          {post?.user.username}
        </Link>
        <p className="text-sm text-gray-400">
          • {formatTimeToNow(post.createdAt)}
        </p>
      </div>
      <div className="hidden md:block">
        <PostImage imageUrl={post.images[0]?.url as string} postId={post.id} />
      </div>
      <Image
        src={post.images[0]?.url as string}
        alt="Cant preview image"
        width={700}
        height={700}
        className="block md:hidden"
      />
      <PostButtons userId={userId} postId={post.id} />
      <div className="flex flex-wrap">
        <div className="whitespace-pre-line overflow-hidden text-ellipsis">
          <span className="text-xs mr-2 inline-flex font-semibold">
            {post?.user.username}
          </span>
          {post?.caption}
        </div>
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

  //todo: arrange overall posts in the desc order.
  const selfPosts = await prisma.post.findMany({
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
  });

  const following = await prisma.followers.findMany({
    where: {
      followerId: user.id,
    },
  });

  const followingPosts = await prisma.post.findMany({
    where: {
      userId: {
        in: following.map((f) => f.followingId),
      },
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
  });

  const feedPosts = [...selfPosts, ...followingPosts];

  return (
    <div className="flex flex-col items-center gap-6 mb-2 container md:max-w-[70%]">
      {feedPosts.map((post) => (
        <Post userId={user.id} post={post} key={post.id} />
      ))}
      <hr className="border-0 hidden md:block w-full h-px mt-2 bg-slate-700 " />

      <span className="italic text-gray-600">
        Follow users to see more posts or create one of your own
      </span>
      <footer>
        <div className="flex items-center mb-2 justify-center gap-2">
          <p className="text-sm text-gray-500">
            Copyright &copy; {new Date().getUTCFullYear()} Trinsta Corp.
          </p>
          <p className="text-sm text-gray-500">All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
