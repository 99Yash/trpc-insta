import { prisma } from '@/server/db';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserPosts } from './user-posts';
import { UserProfile } from './user-profile';

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      name: true,
      username: true,
      bio: true,
      image: true,
    },
  });
  if (!user) notFound();
  return {
    title: `${user.name} (@${user.username})`,
    description: user.bio,
    openGraph: {
      title: `
      ${user.name} (@${user.username}) • Trinsta.
      `,
      description: user.bio ?? '',
      url: '',
      images: [
        {
          url: user.image ?? '',
          width: 400,
          height: 400,
        },
      ],
    },
  };
}

const page = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const { username } = params;

  return (
    <div className=" flex flex-col container gap-4 h-full">
      <UserProfile username={username} />
      <hr className="border-0 hidden md:block h-px mt-2 bg-slate-700" />
      <UserPosts username={username} />
    </div>
  );
};

export default page;
