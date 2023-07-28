/** server/uploadthing.ts */
import { getCurrentUser } from '@/lib/session';

import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';

const f = createUploadthing();

const auth = () => {
  return getCurrentUser();
}; // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: '16MB', maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    // Todo: wait for uploadthing or imagrate to app routes
    .middleware(async (req) => {
      const user = await auth();

      // If you throw, the user will not be able to upload
      if (!user) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { id: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.id);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
