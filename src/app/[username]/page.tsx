import { auth } from '@clerk/nextjs';

const Page = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const { username } = params;
  const { userId } = auth();

  return (
    <div className="container">
      <p>{username}</p>
      <p>{userId}</p>
    </div>
  );
};

export default Page;
