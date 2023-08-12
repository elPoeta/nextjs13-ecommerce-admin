import { z } from "zod";

export const FormModalStoreSchemaValidator = z.object({
  name: z.string().min(3),
});

export type FormModalStoreSchema = z.infer<
  typeof FormModalStoreSchemaValidator
>;

export const FormBillboardSchemaValidator = z.object({
  label: z.string().min(3).optional(),
  imageUrl: z.string().min(3).optional(),
});

export type FormBillboardSchema = z.infer<typeof FormBillboardSchemaValidator>;
