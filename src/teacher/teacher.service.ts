import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll() {
    return await this.teacherRepository.find();
  }

  async findOne(id: number) {
    const teacher = await this.userRepository.findOne({ where: { id } });
    if (!teacher) {
      return new BadRequestException("Teacher not found"); 
    }
    if (teacher.role == 1) {
      return new BadRequestException("Teacher not found");
    }
    return teacher;
  }
}
