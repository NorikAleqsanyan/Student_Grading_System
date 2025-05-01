import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { ModelModule } from './model/model.module';
import { GroupModule } from './group/group.module';
import { Teacher } from './teacher/entities/teacher.entity';
import { Student } from './student/entities/student.entity';
import { Course } from './course/entities/course.entity';
import { Model } from './model/entities/model.entity';
import { HomeworkModule } from './homework/homework.module';
import { GradeModule } from './grade/grade.module';
import { Grade } from './grade/entities/grade.entity';
import { Group } from './group/entities/group.entity';
import { Homework } from './homework/entities/homework.entity';
import { JoiPipeModule } from 'nestjs-joi';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'Student_Grading_System_DB',
      entities: [User, Teacher, Student, Course, Model, Grade, Group, Homework],
      synchronize: false,
    }),
    AuthModule,
    UserModule,
    TeacherModule,
    StudentModule,
    CourseModule,
    ModelModule,
    GroupModule,
    HomeworkModule,
    GradeModule,
    JoiPipeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
