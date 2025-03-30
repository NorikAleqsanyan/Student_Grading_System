import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Teacher } from './entities/teacher.entity';
import { JoiPipeModule } from 'nestjs-joi';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  imports: [TypeOrmModule.forFeature([User,Teacher]),JoiPipeModule],
})
export class TeacherModule {}
