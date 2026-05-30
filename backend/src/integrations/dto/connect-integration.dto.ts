// Elysian — Integration DTOs

import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectIntegrationDto {
  @ApiProperty({ enum: ['apple_health', 'health_connect'] })
  @IsEnum(['apple_health', 'health_connect'])
  provider: 'apple_health' | 'health_connect';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
