import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Homework } from 'src/homework/entities/homework.entity';
import { Model } from 'src/model/entities/model.entity';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Grade) private gradeRepository: Repository<Grade>,
    @InjectRepository(Model) private modelRepository: Repository<Model>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  async create(createGradeDto: CreateGradeDto) {
    const { studentId, homeworkId } = createGradeDto;
    const student = await this.studentRepository.findOneBy({
      userId: studentId,
    });
    if (!student) {
      return { message: 'Student not found', error: true };
    }
    const homework = await this.homeworkRepository.findOneBy({
      id: homeworkId,
    });
    if (!homework) {
      return { message: 'Homework not found', error: true };
    }

    return this.gradeRepository.save(createGradeDto);
  }

  async getGradedByModelId(modelId: number, groupId: number) {
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new BadRequestException(`Model not found`);
    }
    const model = await this.modelRepository.findOneBy({ id: modelId });
    if (!model) {
      throw new BadRequestException(`Model not found`);
    }

    if (model.group.id == groupId) {
      throw new BadRequestException(`Model not found`);
    }
    const homeworks = await this.homeworkRepository.find({
      where:{model,group},
      relations:{
        grade:{
          student:true
        }
      }
    }) 
    return homeworks
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const grade = await this.gradeRepository.findOneBy({ id });
    if (!grade) {
      return { message: 'Grade not found', error: true };
    }
    return this.gradeRepository.save(updateGradeDto);
  }

  async remove(id: number) {
    const grade = await this.homeworkRepository.findOne({ where: { id } });
    if (!grade) {
      return { message: 'Grade not found', error: true };
    }
    await this.homeworkRepository.remove(grade);
    return { message: 'Grade delete', error: false };
  }
}
