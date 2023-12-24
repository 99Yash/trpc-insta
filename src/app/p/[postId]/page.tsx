import { prisma } from '@/server/db';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Post from './Post';

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
          url: post.user.image!,
        },
      ],
    },
  };
}

const PostPage = async ({ params }: PostIdPageProps) => {
  const { postId } = params;
  return <Post postId={postId} />;
};

export default PostPage;
