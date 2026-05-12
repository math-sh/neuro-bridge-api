import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParentDto } from '../dto/create-parent.dto';
import { UpdateParentDto } from '../dto/update-parent.dto';
import { Parent } from '../entities/parent.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private readonly parentsRepository: Repository<Parent>,
  ) {}
  async create(createParentDto: CreateParentDto) {
    try {
      const parent = await this.parentsRepository.create(createParentDto);
      await this.parentsRepository.save(parent);
      return parent;
    } catch (error) {
      throw new HttpException(
        'Failed to create parent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.parentsRepository.find();
  }

  async findOne(id: string) {
    return await this.parentsRepository.findOneBy({ id });
  }

  async update(id: string, updateParentDto: UpdateParentDto) {
    return `This action updates a #${id} parent`;
  }

  async remove(id: string) {
    return `This action removes a #${id} parent`;
  }
}
