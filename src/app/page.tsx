export default function Index() {
  // todo fetch posts either custom, or user specific. if user has 0 followers or is unauthed, use custom posts.
  return (
    <div className="flex container h-screen flex-col gap-3 items-center justify-center">
      <p>Follow users to see their posts. OR create one yourself </p>
    </div>
  );
}
