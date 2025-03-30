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
      throw new BadRequestException(`Course not found`);
    }
    const extingModel = await this.modelRepository.
    createQueryBuilder("model")
    .where('LOWER(model.name) = LOWER(:name)',{name})
    .getOne()
    if (extingModel) {
      return new BadRequestException( "Model name already exists" );
    }

    return this.modelRepository.save(createModelDto);
  }

  async findAll() {
    return await this.modelRepository.find();
  }

  async findOne(id: number) {
    const model = await this.modelRepository.findOne({
      where: { id },
      relations: {
        course: true,
      },
    });
    if (!model) {
      return new BadRequestException('Model not found');
    }
    return model;
  }

  async update(id: number, updateModelDto: UpdateModelDto) {
    const { name } = updateModelDto;
    const model = await this.modelRepository.findOne({ where: { id } });
    if (!model) {
      throw new BadRequestException('Model not found');
    }
    const modelCourse = await this.modelRepository.findOneBy({
      name,
      courseId: model.courseId,
    });
    if (modelCourse) {
      throw new BadRequestException('Course name already exists');
    }
    return await this.modelRepository.update(id, updateModelDto);
  }

  async remove(id: number) {
    const model = await this.modelRepository.findOne({ where: { id } });
    if (!model) {
      return false;
    }
    await this.modelRepository.remove(model);
    return true;
  }
}
