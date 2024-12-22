// error.validation.ts
import { z } from 'zod';

// ✅ Schema for logging errors
export const LogErrorSchema = z.object({
  message: z.string().min(1, 'Message is required and cannot be empty'),
  stack: z.string().optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
});

// ✅ Schema for fetching errors by ID
export const ErrorIdSchema = z.object({
  id: z.string().min(1, 'Error ID is required and must be a valid string'),
});

// ✅ TypeScript Types inferred from Zod Schemas
export type LogErrorInput = z.infer<typeof LogErrorSchema>;
export type ErrorIdInput = z.infer<typeof ErrorIdSchema>;