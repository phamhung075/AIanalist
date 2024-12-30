// trading-economics-news.validation.ts
import { z } from 'zod';

// ✅ Create Schema
export const CreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  time: z.string().min(1, 'Time is required'),
  link: z.string().url('Link must be a valid URL'),
  timestamp: z.number().optional(),
});

// ✅ Update Schema
export const UpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  time: z.string().min(1, 'Time is required').optional(),
  link: z.string().url('Link must be a valid URL').optional(),
  timestamp: z.number().optional(),
});

// ✅ ID Schema
export const IdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});
