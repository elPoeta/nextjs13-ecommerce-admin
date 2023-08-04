import { z } from "zod";

export const FormModalStoreSchemaValidator = z.object({
  name: z.string().min(3),
});

export type FormModalStoreSchema = z.infer<
  typeof FormModalStoreSchemaValidator
>;
