import Image from 'next/image';
import PostModal from '../post-modal';
import { AspectRatio } from '../ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

type UserPostProps = {
  postId: string;
  firstImageUrl: string;
};

const UserPost = ({ postId, firstImageUrl }: UserPostProps) => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <AspectRatio
          ratio={1}
          className="cursor-pointer hover:opacity-70 transition-all"
        >
          <Image
            src={firstImageUrl!}
            alt={'Cant preview Image'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
          />
        </AspectRatio>
      </DialogTrigger>
      <DialogContent className="max-h-full max-w-[80vw]">
        <PostModal postId={postId} />
      </DialogContent>
    </Dialog>
  );
};

export default UserPost;
