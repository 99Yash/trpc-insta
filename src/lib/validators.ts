import { z } from 'zod';
import { isArrayOfFile, isFile } from './utils';

export const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const userProfileSchema = z.object({
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
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
});

export const addPostSchema = z.object({
  caption: z.string().default(''),
  images: z
    .unknown()
    .refine(isArrayOfFile, 'Must be an array of File')
    .nullable()
    .default(null),
});

export const imageFileSchema = z.object({
  image: z.unknown().refine(isFile, 'Must be a file').nullable().default(null),
});

export type PublicMetadata = z.infer<typeof userProfileSchema.shape.username>;
