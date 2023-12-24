/** server/uploadthing.ts */
import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  postImageUploader: f({ image: { maxFileSize: '16MB', maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    // Todo: wait for uploadthing or imagrate to app routes

    .onUploadComplete(() => {
      // This code RUNS ON YOUR SERVER after upload

      console.log('Completed upload');
    }),
  profilePicUploader: f({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(() => {
    console.log('Completed dp upload');
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
