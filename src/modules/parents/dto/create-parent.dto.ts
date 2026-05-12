import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateChildrenDto } from 'src/modules/childrens/dto/create-children.dto';
import { CreateParentAddressDto } from './create-parent-adress.dto';

export class CreateParentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the parent' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the parent',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the parent',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ type: CreateParentAddressDto })
  address: CreateParentAddressDto;

  @ApiProperty({ type: [CreateChildrenDto] })
  childrens: CreateChildrenDto[];
}
