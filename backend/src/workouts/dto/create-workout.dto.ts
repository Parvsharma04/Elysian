// Elysian — Create Workout DTO

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWorkoutDto {
  @ApiProperty({ example: '2026-05-27' })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'strength',
    enum: ['strength', 'cardio', 'yoga', 'hiit', 'cycling', 'running', 'swimming'],
  })
  @IsIn(['strength', 'cardio', 'yoga', 'hiit', 'cycling', 'running', 'swimming'])
  type: 'strength' | 'cardio' | 'yoga' | 'hiit' | 'cycling' | 'running' | 'swimming';

  @ApiProperty({ example: 'Upper Body Push' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 52, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ example: 340 })
  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @ApiProperty({
    example: 'high',
    enum: ['low', 'moderate', 'high', 'extreme'],
  })
  @IsIn(['low', 'moderate', 'high', 'extreme'])
  intensity: 'low' | 'moderate' | 'high' | 'extreme';

  @ApiPropertyOptional({ example: 132 })
  @IsOptional()
  @IsInt()
  @Min(30)
  heart_rate_avg?: number;
}
