import { Icons } from '@/components/icons';
import AddPostButton from '@/components/utilities/add-post-button';
import UserPost from '@/components/utilities/user-post';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/server/db';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserProfile } from './UserProfile';

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
          url: user.image as string,
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
  const user = await getCurrentUser();

  const UserPosts = async () => {
    // todo invalidate posts on creation.
    const postsByUser = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { images: true },
    });
    if (postsByUser.length === 0 && user?.username === username)
      return (
        <div className="h-1/2 flex flex-col gap-4 justify-center items-center">
          <Icons.instagram className="h-10 w-10 text-gray-400 " />
          <h1 className="text-4xl font-bold text-gray-300 ">Share Photos</h1>
          <p className="text-sm text-gray-300 ">
            When you share photos, they will appear on your profile.
          </p>
          <AddPostButton
            variant={'ghost'}
            className="text-blue-400"
            buttonText="Share your first photo"
          />
        </div>
      );
    if (postsByUser.length === 0 && user?.username !== username)
      return (
        <div className="h-1/2 flex flex-col gap-4 justify-center items-center ">
          <Icons.instagram className="h-10 w-10 text-gray-400 " />
          <h1 className="text-4xl font-bold text-gray-300 ">Share Photos</h1>
          <p className="text-sm text-gray-300 ">
            When {username} shares photos, they will appear on their profile.
          </p>
        </div>
      );
    return (
      <div className="grid grid-cols-3 md:gap-4 sm:gap-2 md:mb-4 sm:mb-2 ">
        {/* //todo on clicking the image navigate to a route having a carousel */}
        {postsByUser.map((post) => (
          <UserPost
            key={post.id}
            postId={post.id}
            firstImageUrl={post.images[0]!.url! as string}
          />
        ))}
      </div>
    );
  };

  return (
    <div className=" flex flex-col container gap-4 h-full">
      <UserProfile username={username} />
      <hr className="border-0 hidden md:block h-px mt-2 bg-slate-700" />
      <UserPosts />
    </div>
  );
};

export default page;
