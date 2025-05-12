import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Model) private modelRepository: Repository<Model>,
  ) {}

  async create(createModelDto: CreateModelDto) {
    const { name, courseId } = createModelDto;
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      
      return { message: 'Course not found.', error: true };
    }
    const extingModel = await this.modelRepository.findOne({
      where: { name: name },
    });
    if (extingModel) {
      
      return { message: 'Model name already exists', error: true };
    }

    
    return this.modelRepository.save(createModelDto);
  }

  async findAll() {
    
    return await this.modelRepository.find({ relations: { course: true } });
  }

  async findOne(id: number) {
    const model = await this.modelRepository.findOne({
      where: { id },
      relations: {
        course: true,
      },
    });
    if (!model) {
      
      return { message: 'Model not found.', error: true };
    }

    return model;
  }

  async update(id: number, updateModelDto: UpdateModelDto) {
    const { name } = updateModelDto;
    const model = await this.modelRepository.findOne({ where: { id } });
    if (!model) {
      return { message: 'Model not found.', error: true };
    }
    const modelCourse = await this.modelRepository.findOneBy({
      name,
      courseId: model.courseId,
    });
    if (modelCourse) {

      return { message: 'Course name already exists', error: true };
    }
    await this.modelRepository.update(id, updateModelDto);

    
    return { message: 'Model update.', error: false };
  }

  async remove(id: number) {
    const model = await this.modelRepository.findOne({ where: { id } });
    if (!model) {

      
      return { message: 'Model not found.', error: true };
    }
    await this.modelRepository.remove(model);

    
    return { message: 'Model delete.', error: false };
  }
}
