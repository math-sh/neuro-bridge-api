import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'email.test@email.com',
    type: 'string',
  })
  @IsString()
  email: string;
}
