import { z } from 'zod';

export const userPublicMetadataSchema = z.object({
  bio: z
    .string()
    .max(300, {
      message: 'Bio must be less than 300 characters',
    })
    .optional(),
  username: z.string().max(55, {
    message: 'Username must be less than 85 characters',
  }),
});

export type PublicMetadata = z.infer<
  typeof userPublicMetadataSchema.shape.username
>;
