import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { hashPassword } from 'src/core/common/utils/hash';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const hash = await hashPassword(createUserDto.password);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hash,
      });
      await this.userRepository.save(user);
      return {
        status: 'success',
        message: 'User created successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Error creating user: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneOptions(findOptions: FindOneOptions<User>) {
    try {
      const user = await this.userRepository.findOne(findOptions);
      if (!user) return null;
      return user;
    } catch (error) {
      throw new HttpException(
        `Error finding user: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) return null;
      return user;
    } catch (error) {
      throw new HttpException(
        `Error finding user: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const updateUser = this.userRepository.merge(user, updateUserDto);
      await this.userRepository.save(updateUser);
      return {
        status: 'success',
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Error updating user: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.userRepository.softDelete(id);
      return {
        status: 'success',
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Error deleting user: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
