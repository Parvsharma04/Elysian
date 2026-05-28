// Elysian — Query Health DTO

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class QueryHealthDto {
  @ApiPropertyOptional({ example: 30, description: 'Number of days to fetch (default: 30)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 30;
}
