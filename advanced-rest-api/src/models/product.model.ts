import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(500),
  price: z.number().positive(),
  category: z.string().min(2),
  createdAt: z.date().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  body: ProductSchema.omit({ id: true, createdAt: true }),
});

export const UpdateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: ProductSchema.omit({ id: true, createdAt: true }).partial(),
});
