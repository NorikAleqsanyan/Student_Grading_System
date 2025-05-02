import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async findAll() {
    return await this.studentRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { userId: id },
      relations: ['user'],
    });
    if (!student) {
      return { message: 'Student not found.', error: true };
    }
    return student;
  }
}
