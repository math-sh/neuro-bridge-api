import { Module } from '@nestjs/common';
import { UsersService } from './domain/users.service';
import { UsersController } from './http/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
