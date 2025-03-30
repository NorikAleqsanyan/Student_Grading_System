import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { Homework } from './entities/homework.entity';
import { Model } from 'src/model/entities/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiPipeModule } from 'nestjs-joi';
import { Group } from 'src/group/entities/group.entity';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService],
  imports: [TypeOrmModule.forFeature([Homework,Model,Group]),JoiPipeModule],
})
export class HomeworkModule {}
