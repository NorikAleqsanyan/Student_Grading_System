import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Homework } from 'src/homework/entities/homework.entity';
import { Model } from 'src/model/entities/model.entity';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

/**
 * Service for managing grades.
 */
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

  /**
   * Creates a new grade for a student on a homework assignment.
   *
   * @param {CreateGradeDto} createGradeDto - The data for creating the grade.
   * @returns {Promise<Grade | { message: string, error: boolean }>}
   * - Returns the created grade if successful, or an error message if student or homework is not found.
   */
  async create(
    createGradeDto: CreateGradeDto,
  ): Promise<Grade | { message: string; error: boolean }> {
    const { studentId, homeworkId, rate } = createGradeDto;

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

    return this.gradeRepository.save({ studentId, homeworkId, rate });
  }

  /**
   * Retrieves all graded homeworks for a given group and model.
   *
   * @param {number} groupId - The ID of the group.
   * @param {number} modelId - The ID of the model.
   * @returns {Promise<Homework[]>} - Returns the list of graded homeworks for the specified group and model.
   */
  async getGradedByModelId(
    groupId: number,
    modelId: number,
  ): Promise<Homework[] | { message: string; error: boolean }> {
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      
      return { message: `Group not found`, error: true };
    }

    const model = await this.modelRepository.findOne({
      where: { id: modelId },
      relations: { group: true },
    });

    if (!model) {
      
      return { message: `Model not found`, error: true };
    }

    if (model.group.id == groupId) {
      
      return { message: `Model group not found`, error: true };
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

  /**
   * Updates the grade of a homework assignment.
   *
   * @param {number} id - The ID of the grade to update.
   * @param {UpdateGradeDto} updateGradeDto - The data to update the grade with.
   * @returns {Promise<{ message: string, error: boolean }>}
   * - Returns a success message if updated, or an error message if the grade is not found.
   */
  async update(
    id: number,
    updateGradeDto: UpdateGradeDto,
  ): Promise<{ message: string; error: boolean }> {
    const grade = await this.gradeRepository.findOneBy({ id });
    if (!grade) {
      
      return { message: 'Grade not found', error: true };
    }

    await this.gradeRepository.update(id, updateGradeDto);
    
    return { message: 'Grade update', error: false };
  }

  /**
   * Deletes a grade by its ID.
   *
   * @param {number} id - The ID of the grade to delete.
   * @returns {Promise<{ message: string, error: boolean }>}
   * - Returns a success message if deleted, or an error message if grade is not found.
   */
  async remove(id: number): Promise<{ message: string; error: boolean }> {
    const grade = await this.homeworkRepository.findOne({ where: { id } });
    if (!grade) {
      
      return { message: 'Grade not found', error: true };
    }

    await this.homeworkRepository.remove(grade);
    
    return { message: 'Grade deleted', error: false };
  }
}
