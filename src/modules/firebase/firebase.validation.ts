// firebase.validation.ts
import { z } from 'zod';

export const CreateFirebaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  message: z.string().optional(),
});

export const UpdateFirebaseSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  message: z.string().optional(),
});

export const FirebaseIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type CreateFirebaseInput = z.infer<typeof CreateFirebaseSchema>;
export type UpdateFirebaseInput = z.infer<typeof UpdateFirebaseSchema>;
export type FirebaseIdInput = z.infer<typeof FirebaseIdSchema>;
