import EditProfile from '@/components/forms/edit-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { prisma } from '@/server/db';

const page = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const { username } = params;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      posts: true,
    },
  });
  return (
    <div className="h-9/10 flex items-center gap-6 text-gray-300">
      <Avatar className="md:h-36 md:w-36 h-20 w-20 border border-slate-950 mb-5">
        <AvatarImage src={user?.image as string} alt="You" />
        <AvatarFallback>You</AvatarFallback>
      </Avatar>
      <div className="hidden md:flex md:w-1/2  md:flex-col gap-1">
        <div className="flex gap-10 items-baseline">
          <h5 className="text-md font-medium">{user?.username}</h5>
          <EditProfile
            username={username as string}
            bio={(user?.bio as string) || ''}
          />
        </div>
        <h5 className="text-md font-semibold ">{user?.name}</h5>
        <p className="text-sm text-gray-400">{user?.bio}</p>
      </div>
    </div>
  );
};

export default page;
