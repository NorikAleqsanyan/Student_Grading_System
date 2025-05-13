import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  /**
   * Creates a new course.
   * @param createCourseDto - Data for creating a course.
   * @returns The created course or an error message if the name already exists.
   */
  async create(createCourseDto: CreateCourseDto): Promise<Course | object> {
    const { name, description } = createCourseDto;
    const existingCourse = await this.courseRepository.findOne({
      where: { name },
    });
    if (existingCourse) {
     
      return { message: 'Course name already exists.', error: true };
    }

    return this.courseRepository.save({ name, description });
  }

  /**
   * Retrieves all courses along with their related models.
   * @returns A list of all courses.
   */
  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find({
      relations: ['models'],
    });
  }

  /**
   * Retrieves a course by its ID with related models.
   * @param id - The ID of the course.
   * @returns The course or an error message if not found.
   */
  async findOne(id: number): Promise<Course | object> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { models: true },
    });
    if (!course) {
     
      return { message: 'Course not found.', error: true };
    }

    return course;
  }

  /**
   * Updates a course by its ID.
   * @param id - The ID of the course.
   * @param updateCourseDto - The new data to update the course with.
   * @returns A success message or an error message if not found or name already exists.
   */
  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<object> {
    const { name } = updateCourseDto;
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
     
      return { message: 'Course not found.', error: true };
    }

    const existingCourse = await this.courseRepository.findOne({
      where: { name },
    });
    if (existingCourse && existingCourse.id !== id) {
     
      return { message: 'Course name already exists.', error: true };
    }

    await this.courseRepository.update(id, updateCourseDto);
   
    return { message: 'Course updated.', error: false };
  }

  /**
   * Deletes a course by its ID.
   * @param id - The ID of the course.
   * @returns A success message or an error message if not found.
   */
  async remove(id: number): Promise<object> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
     
      return { message: 'Course not found.', error: true };
    }

    await this.courseRepository.remove(course);
   
    return { message: 'Course deleted.', error: false };
  }
}
