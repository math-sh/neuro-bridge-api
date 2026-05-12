import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChildrenDto {
  @ApiProperty({
    example: 'Jane Doe',
    description: 'The name of the child',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2010-01-01',
    description: 'The birth date of the child',
  })
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    example: 'Female',
    description: 'The gender of the child',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    example: 2,
    description: 'The support level of the child',
  })
  @IsNumber()
  @IsNotEmpty()
  support: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the parent associated with the child',
  })
  @IsString()
  @IsNotEmpty()
  parentId: string;
}
