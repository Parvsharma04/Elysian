// PulseAI — Update Profile DTO

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  display_name?: string;

  @ApiPropertyOptional({ example: 75.0 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(500)
  target_weight?: number;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(100000)
  target_steps?: number;

  @ApiPropertyOptional({ example: 7.5 })
  @IsOptional()
  @IsNumber()
  @Min(4)
  @Max(12)
  target_sleep_hours?: number;

  @ApiPropertyOptional({ example: 140 })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(500)
  target_protein?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  onboarded?: boolean;
}
