import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Некорректный формат email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export type AuthDto = z.infer<typeof authSchema>;
