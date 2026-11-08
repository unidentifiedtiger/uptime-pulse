import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException({
        message: 'Ошибка валидации',
        errors: (error as any).errors,
      });
    }
  }
}
