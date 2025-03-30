import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { Grade } from './entities/grade.entity';
import { Student } from 'src/student/entities/student.entity';
import { JoiPipeModule } from 'nestjs-joi';
import { Group } from 'src/group/entities/group.entity';
import { Model } from 'src/model/entities/model.entity';

@Module({
  controllers: [GradeController],
  providers: [GradeService],
  imports: [TypeOrmModule.forFeature([Homework,Grade,Student]),JoiPipeModule   ],
})
export class GradeModule {}
