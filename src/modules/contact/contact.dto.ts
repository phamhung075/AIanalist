import { z } from "zod";
import { CreateContactSchema, UpdateContactSchema, ContactIdSchema } from "./contact.validation";

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type ContactIdInput = z.infer<typeof ContactIdSchema>;