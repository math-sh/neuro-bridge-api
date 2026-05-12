import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildrensService } from './domain/childrens.service';
import { Children } from './entities/children.entity';
import { ChildrensController } from './http/childrens.controller';

@Module({
  controllers: [ChildrensController],
  providers: [ChildrensService],
  imports: [TypeOrmModule.forFeature([Children])],
})
export class ChildrensModule {}
