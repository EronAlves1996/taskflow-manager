import { BadRequestException } from '@nestjs/common';

export function getPositiveNumericValue(
  value: string | null,
  paramName: string,
) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new BadRequestException(`${paramName} must be a number`);
  }

  if (numericValue <= 0) {
    throw new BadRequestException(`${paramName} must be a positive number`);
  }

  return numericValue;
}
