import z from 'zod';

// eslint-disable-next-line import/prefer-default-export
export const userSchema = z.object({
  electronId: z.string(),
  plan: z.object({
    type: z.string(),
  }),
  trial: z.object({
    startDate: z.number().nullable(),
    endDate: z.number().nullable(),
  }),
  stripePaymentId: z.string().optional(),
});
