import { plainToInstance } from 'class-transformer';
import { IsIn, validateSync } from 'class-validator';

class EnvVars {
  @IsIn(['info', 'debug', 'warn', 'error'])
  LOG_LEVEL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
