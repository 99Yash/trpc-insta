import { z } from 'zod';

export const userPublicMetadataSchema = z.object({
  bio: z
    .string()
    .max(300, {
      message: 'Bio must be less than 300 characters',
    })
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

export const addPostSchema = z.object({
  caption: z.string().optional(),
  image: z.any(),
});

export type PublicMetadata = z.infer<
  typeof userPublicMetadataSchema.shape.username
>;
