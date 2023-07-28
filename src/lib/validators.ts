import { z } from 'zod';

export const userPublicMetadataSchema = z.object({
  bio: z
    .string()
    .max(300, {
      message: 'Bio must be less than 300 characters',
    })
    .default('')
    .optional(),
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters',
    })
    .max(55, {
      message: 'Username must be less than 55 characters',
    }),
});

export const addPostSchema = z
  .object({
    caption: z.string().default(''),
    images: z.array(z.unknown()).refine(
      (val) => {
        return val !== undefined && val.length <= 3;
      },
      {
        message:
          'Image is required and cannot be empty. Maximum 3 images allowed.',
        path: ['images'],
      }
    ),
  })
  .refine(
    (val) => {
      //? This allows to accept a single image file as well, iff it is an instanceof File
      if (!Array.isArray(val)) {
        return val instanceof File;
      } else {
        return val.every((file) => file instanceof File);
        //? Check for array of files
      }
    },
    {
      message: 'Image is required and cannot be null.',
      path: ['images'],
    }
  );

export type PublicMetadata = z.infer<
  typeof userPublicMetadataSchema.shape.username
>;
