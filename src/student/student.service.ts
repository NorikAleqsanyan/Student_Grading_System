import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  /**
   * Retrieves all students along with their associated user entities.
   * 
   * @returns Array of student entities with user data
   */
  async findAll() {

    return await this.studentRepository.find({
      relations: ['user'],
    });
  }

  /**
   * Finds a single student by the associated user's ID.
   * 
   * @param id - The user ID to search by
   * @returns The student entity or an error message if not found
   */
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
