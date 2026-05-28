// Elysian — Send Chat Message DTO

import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Generate today\'s workout plan' })
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  content: string;
}
