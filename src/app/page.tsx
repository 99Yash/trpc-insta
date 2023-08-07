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
        comments: {
          take: 1,
          include: {
            user: {
              select: {
                username: true,
                image: true,
                name: true, //? for fallback image
              },
            },
          },
        },
      },
    });
    return (
      <div className="flex flex-col">
        {randomPosts.map((post) => (
          <div
            key={post.id}
            className="flex border border-gray-500 flex-col gap-3 items-center "
          >
            <Image
              src={post.images[0]?.url as string}
              alt="Cant preview image"
              width={400}
              height={400}
            />
            <div className="flex gap-2">
              <CustomAvatar
                imgUrl={post.comments[0]?.user.image as string}
                name={post?.comments[0]?.user.name as string}
              />
              <p>{post.comments[0]?.user.username}</p>
              <p>{post.comments[0]?.text}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  const feedPosts = await prisma.post.findMany({
    where: {
      userId: user.id,
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
      comments: {
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
    },
    take: 5,
  });
  return (
    <div className="flex flex-col gap-3 items-center mb-2 ">
      {feedPosts.map((post) => (
        <div
          key={post.id}
          className="flex border border-gray-500 flex-col gap-3"
        >
          <Image
            src={post.images[0]?.url as string}
            alt={post.caption || 'Cant preview image'}
            width={400}
            height={400}
          />
          <div className="flex flex-wrap items-center gap-1 px-2">
            <CustomAvatar
              imgUrl={post.user.image as string}
              name={post?.user.name as string}
            />
            <p>{post?.user.username}</p>
            <p className="text-sm">{post?.caption}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1 px-6">
            <CustomAvatar
              imgUrl={post.comments[0]?.user.image as string}
              name={post?.comments[0]?.user.name as string}
            />
            <p>{post.comments[0]?.user.username}</p>
            <p className="text-sm">{post.comments[0]?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
