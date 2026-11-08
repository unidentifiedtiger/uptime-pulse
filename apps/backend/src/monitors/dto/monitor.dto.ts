import { z } from 'zod';

export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  url: z.string().url('Некорректный URL'),
  interval: z.number().int().positive().default(60),
  timeout: z.number().int().positive().default(5000),
  isPublic: z.boolean().optional()
});

export type CreateMonitorDto = z.infer<typeof createMonitorSchema>;
