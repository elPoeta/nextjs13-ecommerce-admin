import { z } from "zod";

export const FormModalStoreSchemaValidator = z.object({
  name: z.string().min(3),
});

export type FormModalStoreSchema = z.infer<
  typeof FormModalStoreSchemaValidator
>;

export const FormBillboardSchemaValidator = z.object({
  label: z.string().min(3),
  imageUrl: z.string().min(3),
});

export type FormBillboardSchema = z.infer<typeof FormBillboardSchemaValidator>;

export const FormCategorySchemaValidator = z.object({
  name: z.string().min(3),
  billboardId: z.string(),
});

export type FormCategorySchema = z.infer<typeof FormCategorySchemaValidator>;

export const FormSizeSchemaValidator = z.object({
  name: z.string().min(3),
  value: z.string().min(1),
});

export type FormSizeSchema = z.infer<typeof FormSizeSchemaValidator>;

export const FormColorSchemaValidator = z.object({
  name: z.string().min(3),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be a valid hex color.",
  }),
});

export type FormColorSchema = z.infer<typeof FormColorSchemaValidator>;

export const FormProductSchemaValidator = z.object({
  name: z.string().min(3),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(3),
  sizeId: z.string().min(3),
  colorId: z.string().min(3),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  images: z.object({ url: z.string() }).array(),
});

export type FormProductSchema = z.infer<typeof FormProductSchemaValidator>;
