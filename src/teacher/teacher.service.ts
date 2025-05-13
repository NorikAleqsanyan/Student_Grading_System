import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  /**
   * Retrieves all teachers along with their associated user entities.
   * 
   * @returns Array of teacher entities with user data
   */
  async findAll() {

    return await this.teacherRepository.find({ relations: ['user'] });
  }

  /**
   * Finds a single teacher by the associated user's ID.
   * 
   * @param id - The user ID to search by
   * @returns The teacher entity or an error message if not found
   */
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
