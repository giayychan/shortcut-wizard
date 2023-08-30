import z from 'zod';

export const ShortcutSchema = z.object({
  id: z.string(),
  description: z.string(),
  hotkeys: z.array(z.array(z.string())),
  isFavorite: z.boolean(),
});

export const SoftwareSchema = z.object({
  software: z.object({
    key: z.string(),
    icon: z.object({
      isCustom: z.boolean(),
      filename: z.string(),
      dataUri: z.string().optional(),
    }),
  }),
  shortcuts: z.array(ShortcutSchema),
  createdDate: z.string(),
});

export const AllSoftwaresSchema = z.array(SoftwareSchema);
