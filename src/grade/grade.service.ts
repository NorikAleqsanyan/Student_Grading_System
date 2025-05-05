import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

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
      return { message: 'Student not found', error: true };
    }
    const homework = await this.homeworkRepository.findOneBy({ id: homeworkId });
    if (!homework) {
      return { message: 'Homework not found', error: true };
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
