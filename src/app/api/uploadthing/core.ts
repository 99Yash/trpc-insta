import { getCurrentUser } from "@/lib/session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const auth = async () => {
  return await getCurrentUser();
};
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  postImageUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = await auth();
 
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
 
      console.log("file url", file.url);
 
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
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