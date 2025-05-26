
import { z } from 'zod';

export const PostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    content: z.string().min(1, 'Content is required').max(280, 'Content must be less than 280 characters'),
    image: z.string().optional(),
});

export type PostSchemaType = z.infer<typeof PostSchema>;


