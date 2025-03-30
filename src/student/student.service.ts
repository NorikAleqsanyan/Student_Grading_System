import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  
  async findAll() {
    return await this.studentRepository.find();
  }

  async findOne(id: number) {
    const student = await this.userRepository.findOne({ where: { id } });
    if (!student) {
      return new BadRequestException("Student not found"); 
    }
    if (student.role == 0) {
      return new BadRequestException("Student not found");
    }
    return student;
  }
}