import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { JoiPipeModule } from 'nestjs-joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Model } from 'src/model/entities/model.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    TypeOrmModule.forFeature([Group, Model, Teacher, Course]),
    JoiPipeModule,
  ],
})
export class GroupModule {}
