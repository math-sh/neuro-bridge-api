import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChildrensService } from '../domain/childrens.service';
import { CreateChildrenDto } from '../dto/create-children.dto';
import { UpdateChildrenDto } from '../dto/update-children.dto';

@Controller('childrens')
export class ChildrensController {
  constructor(private readonly childrensService: ChildrensService) {}

  @Post()
  create(@Body() createChildrenDto: CreateChildrenDto) {
    return this.childrensService.create(createChildrenDto);
  }

  @Get()
  findAll() {
    return this.childrensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childrensService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChildrenDto: UpdateChildrenDto,
  ) {
    return this.childrensService.update(+id, updateChildrenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childrensService.remove(+id);
  }
}
