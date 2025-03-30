import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const { name } =
      createCourseDto;
    const extingCourse = await this.courseRepository.
    createQueryBuilder("course")
    .where('LOWER(course.name) = LOWER(:name)',{name})
    .getOne()
    if (extingCourse) {
      return new BadRequestException( "Course name already exists" );
    }
    return this.courseRepository.save(createCourseDto);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({ where: { id } , relations:{
      models:true
    }});
    if (!course) {
      return new BadRequestException("Course not found"); 
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const {name} =  updateCourseDto
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
       throw new BadRequestException("Course not found") 
    }
    const extingCourse = await this.courseRepository.
    createQueryBuilder("course")
    .where('LOWER(course.name) = LOWER(:name)',{name})
    .getOne()
    if (extingCourse) {
      return new BadRequestException( "Course name already exists" );
    }
    return await this.courseRepository.update(id, updateCourseDto);

  }

  async remove(id: number):Promise<boolean> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      return false;
    }  
    await this.courseRepository.remove(course);
    return true
  }
}
