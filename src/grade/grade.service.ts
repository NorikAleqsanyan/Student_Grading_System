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

  async getGradedByModelId(groupId: number, modelId: number) {
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new BadRequestException(`Group not found`);
    }

    const model = await this.modelRepository.findOne({
      where: { id: modelId },
      relations: { group: true },
    });

    if (!model) {
      throw new BadRequestException(`Model not found`);
    }

    if (model.group.id == groupId) {
      throw new BadRequestException(`Model group not found`);
    }
    const homeworks = await this.homeworkRepository
    .createQueryBuilder('homework')
    .leftJoinAndSelect('homework.grade', 'grade')
    .leftJoinAndSelect('grade.student', 'student')
    .leftJoinAndSelect('homework.model', 'model')
    .leftJoinAndSelect('homework.group', 'group')
    .where('model.id = :modelId', { modelId })
    .andWhere('group.id = :groupId', { groupId })
    .getMany();

    return homeworks;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const grade = await this.gradeRepository.findOneBy({ id });
    if (!grade) {
      return { message: 'Grade not found', error: true };
    }
    this.gradeRepository.update(id, updateGradeDto);
    return { message: 'Grade uptade', error: false };
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
