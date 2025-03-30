import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';
import { Group } from 'src/group/entities/group.entity';
import { Model } from 'src/model/entities/model.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Homework) private homeworkRepository: Repository<Homework>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Grade) private gradeRepository: Repository<Grade>,
    ) {}

  async create(createGradeDto: CreateGradeDto) {
    const { studentId,homeworkId } = createGradeDto;
    const student = await this.studentRepository.findOneBy({ userId: studentId });
    if (!student) {
      return new BadRequestException(`Student not found`);
    }
    const homework = await this.homeworkRepository.findOneBy({ id: homeworkId });
    if (!homework) {
      return new BadRequestException(`Homework not found`);
    }

    return this.gradeRepository.save(createGradeDto);
  }

  // async getGreadByModelId(modelId: number,groupId: number) {

  //   const homework = await this.homeworkRepository.findOneBy({ id: modelId });
  //   if (!homework) {
  //     throw new BadRequestException(`Homework not found`);
  //   }
  //   const model = await this.modelRepository.findOneBy({ id: modelId });
  //   if (!model) {
  //     throw new BadRequestException(`Model not found`);
  //   }
  //   const grades = await this.gradeRepository.find({
  //     where: {
  //       modelId: homework.modelId,
  //     },
  //   });
  //   return grades
  // }//////////////???????????????????

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const grade = await this.gradeRepository.findOneBy({id})
    if (!grade) {
      return new BadRequestException(`Grade not found`);
    }
    return this.gradeRepository.save(updateGradeDto);
  }

  async remove(id: number) {
    const grade = await this.homeworkRepository.findOne({ where: { id } });
    if (!grade) {
      return false;
    }
    await this.homeworkRepository.remove(grade);
    return true;
  }
}
