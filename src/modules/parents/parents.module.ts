import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentsService } from './domain/parents.service';
import { Parent } from './entities/parent.entity';
import { ParentsController } from './http/parents.controller';

@Module({
  controllers: [ParentsController],
  providers: [ParentsService],
  imports: [TypeOrmModule.forFeature([Parent])],
})
export class ParentsModule {}
