import { createNextPageApiHandler } from 'uploadthing/next-legacy';

import { ourFileRouter } from '@/server/uploadthing';

const handler = createNextPageApiHandler({
  router: ourFileRouter,
});

export default handler;

import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
export const uploadRouter = { ourFileRouter };