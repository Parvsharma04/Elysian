// PulseAI — Create Health Day DTO

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateHealthDayDto {
  @ApiProperty({ example: '2026-05-27' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 8500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  steps?: number;

  @ApiPropertyOptional({ example: 2200 })
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsInt()
  @Min(0)
  active_minutes?: number;

  @ApiPropertyOptional({ example: 72 })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(220)
  heart_rate_avg?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(120)
  heart_rate_resting?: number;

  @ApiPropertyOptional({ example: 52 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  hrv?: number;

  @ApiPropertyOptional({ example: 7.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  sleep_hours?: number;

  @ApiPropertyOptional({ example: 82 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  sleep_quality?: number;

  @ApiPropertyOptional({ example: 1.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sleep_deep?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sleep_rem?: number;

  @ApiPropertyOptional({ example: 3.2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sleep_light?: number;

  @ApiPropertyOptional({ example: 0.4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sleep_awake?: number;

  @ApiPropertyOptional({ example: 78.5 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(500)
  weight?: number;

  @ApiPropertyOptional({ example: 2500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  water_ml?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  protein_g?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsInt()
  @Min(0)
  carbs_g?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsInt()
  @Min(0)
  fat_g?: number;
}
