import { z } from "zod";
import { CreateSchema, UpdateSchema, IdSchema } from "./trading-economics-new.validation";

export type CreateInput = z.infer<typeof CreateSchema>;
export type UpdateInput = z.infer<typeof UpdateSchema>;
export type IdInput = z.infer<typeof IdSchema>;