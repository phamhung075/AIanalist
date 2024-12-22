// contact.validation.ts
import { z } from 'zod';

export const CreateContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  message: z.string().optional(),
});

export const UpdateContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  message: z.string().optional(),
});

export const ContactIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type ContactIdInput = z.infer<typeof ContactIdSchema>;
