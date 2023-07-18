import { auth } from '@clerk/nextjs';

export default async function Index() {
  const { sessionId } = auth();
  console.log(sessionId);
  return (
    <div className="flex container h-screen flex-col gap-3 items-center justify-center">
      {sessionId ? (
        <>
          <h1 className="text-5xl font-bold">
            You are logged in. Start creating posts/ follow friends.
          </h1>
        </>
      ) : (
        <>
          <h1 className="text-6xl font-bold text-pink-700 animate-in fade-in-5">
            Welcome to Trinstagram.
          </h1>
          <p>Follow users to see their posts. OR create one yourself </p>
        </>
      )}
    </div>
  );
}
