import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChildrenDto } from '../dto/create-children.dto';
import { UpdateChildrenDto } from '../dto/update-children.dto';
import { Children } from '../entities/children.entity';

@Injectable()
export class ChildrensService {
  constructor(
    @InjectRepository(Children)
    private readonly childrensRepository: Repository<Children>,
  ) {}
  async create(createChildrenDto: CreateChildrenDto) {
    try {
      const children = await this.childrensRepository.create(createChildrenDto);
      await this.childrensRepository.save(children);
      return children;
    } catch (error) {}
  }

  findAll() {
    return `This action returns all childrens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} children`;
  }

  update(id: number, updateChildrenDto: UpdateChildrenDto) {
    return `This action updates a #${id} children`;
  }

  remove(id: number) {
    return `This action removes a #${id} children`;
  }
}
