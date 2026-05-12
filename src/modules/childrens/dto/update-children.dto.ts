import { PartialType } from '@nestjs/swagger';
import { CreateChildrenDto } from './create-children.dto';

export class UpdateChildrenDto extends PartialType(CreateChildrenDto) {}
