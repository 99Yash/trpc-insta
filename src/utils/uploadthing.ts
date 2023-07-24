import { generateComponents } from '@uploadthing/react';

import type { OurFileRouter } from '@/server/uploadthing';

import { generateReactHelpers } from '@uploadthing/react/hooks';

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
