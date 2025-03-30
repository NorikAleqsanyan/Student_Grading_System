import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { JoiPipeModule } from 'nestjs-joi';
import { Model } from './entities/model.entity';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ModelController],
  providers: [ModelService],
  imports: [TypeOrmModule.forFeature([Course,Model]),JoiPipeModule],
})
export class ModelModule {}
