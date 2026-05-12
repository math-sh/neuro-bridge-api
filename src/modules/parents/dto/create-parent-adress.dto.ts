import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParentAddressDto {
  @ApiProperty({
    example: '123 Main St',
    description: 'The street address of the parent',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 'Springfield',
    description: 'The city of the parent',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'IL',
    description: 'The state of the parent',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: '62704',
    description: 'The postal code of the parent',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({
    example: 'Neighborhood',
    description: 'The neighborhood of the parent',
  })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({
    example: '100',
    description: 'The house number of the parent',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'The apartment number of the parent (if applicable)',
  })
  @IsString()
  @IsNotEmpty()
  complement: string;
}
