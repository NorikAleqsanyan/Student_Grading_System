import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    const { name } = createCourseDto;
    const extingCourse = await this.courseRepository.findOne({
      where: { name: name },
    });
    if (extingCourse) {
      return { message: 'Course name already exists.', error: true };
    }

    return this.courseRepository.save(createCourseDto);
  }

  async findAll() {
    return await this.courseRepository.find({
      relations: ['models'],
    });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: {
        models: true,
      },
    });
    if (!course) {
      return { message: 'Course not found.', error: true };
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const { name } = updateCourseDto;
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      return { message: 'Course not found.', error: true };
    }
    const extingCourse = await this.courseRepository.findOne({
      where: { name: name },
    });
    if (extingCourse) {
      return { message: 'Course name already exists.', error: true };
    }
    await this.courseRepository.update(id, updateCourseDto);

    return { message: 'Course update.', error: false };
  }

  async remove(id: number): Promise<object> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      return { message: 'Course not found.', error: true };
    }

    await this.courseRepository.remove(course);

    return { message: 'Course delete.', error: false };
  }
}
