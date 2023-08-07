import CustomAvatar from '@/components/utilities/custom-avatar';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/server/db';
import Image from 'next/image';

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
        user: true,
      },
    });
    return (
      <div className="flex flex-col items-center gap-6 mb-2">
        {randomPosts.map((post) => (
          <div key={post.id} className="flex flex-col gap-3">
            <Image
              src={post.images[0]?.url as string}
              alt={post.caption || 'Cant preview image'}
              width={590}
              height={590}
            />
            <div className="flex flex-wrap items-center gap-1 px-2">
              <p>{post?.user.username}</p>
              <p className="text-sm">{post?.caption}</p>
            </div>
            <hr className="border-0 h-px mt-2 bg-slate-700" />
          </div>
        ))}
      </div>
    );
  }
  const feedPosts = await prisma.post.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true,
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
  return (
    <div className="flex flex-col gap-6 items-center mb-2 ">
      {feedPosts.map((post) => (
        <div key={post.id} className="flex flex-col gap-3">
          <div className="flex items-center">
            <CustomAvatar
              imgUrl={post.user.image as string}
              name={post?.user.name as string}
            />
            <p>{post?.user.username}</p>
          </div>
          <Image
            src={post.images[0]?.url as string}
            alt={post.caption || 'Cant preview image'}
            width={640}
            height={640}
          />
          <div className="flex flex-wrap items-center gap-1 px-2">
            <p>{post?.user.username}</p>
            <p className="text-sm">{post?.caption}</p>
          </div>
          <hr className="border-0 h-px mt-2 bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
