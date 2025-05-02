import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}
  async findAll() {
    return await this.teacherRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { userId: id },
      relations: ['user'],
    });
    if (!teacher) {
      return { message: 'Teacher not found.', error: true };
    }
    return teacher;
  }
}
