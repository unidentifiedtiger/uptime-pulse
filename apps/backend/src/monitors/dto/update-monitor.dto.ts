import { z } from 'zod';

export const updateMonitorSchema = z.object({
  name: z.string().max(255).optional(),
  interval: z.coerce.number().int().min(10).optional(),
  timeout: z.coerce.number().int().min(1000).optional(),
  isPublic: z.boolean().optional(),
});

export type UpdateMonitorDto = z.infer<typeof updateMonitorSchema>;
