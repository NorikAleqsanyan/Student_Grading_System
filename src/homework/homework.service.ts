import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Model } from 'src/model/entities/model.entity';
import { Repository } from 'typeorm';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Homework } from './entities/homework.entity';

/**
 * Service for managing homework assignments.
 */
@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Model) private modelRepository: Repository<Model>,
  ) {}

  /**
   * Creates a new homework assignment.
   * 
   * @param {CreateHomeworkDto} createHomeworkDto - The data to create a new homework assignment.
   * @returns {Promise<Homework | { message: string, error: boolean }>} 
   * - Returns the created homework object if successful.
   * - Returns an error message if the group or model is not found or if the model is not active in the group.
   */
  async create(createHomeworkDto: CreateHomeworkDto): Promise<object | null>  {
    const { modelId, groupId, title, body } = createHomeworkDto;
    
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {

      return { message: 'Group not found', error: true };
    }

    const model = await this.modelRepository.findOneBy({ id: modelId });
    if (!model) {

      return { message: 'Model not found', error: true };
    }

    if (group.activeModelId !== model.id) {

      return { message: 'This model is not active in group', error: true };
    }

    return this.homeworkRepository.save({
      modelId,
      groupId, 
      title, 
      body,
      date: new Date(),
    });
  }

  /**
   * Removes a homework assignment by ID.
   * 
   * @param {number} id - The ID of the homework to remove.
   * @returns {Promise<{ message: string, error: boolean }>} 
   * - Returns a success message if the homework is successfully deleted.
   * - Returns an error message if the homework is not found.
   */
  async remove(id: number): Promise<object | null>  {
    const homework = await this.homeworkRepository.findOne({ where: { id } });
    if (!homework) {

      return { message: 'Homework not found', error: true };
    }

    await this.homeworkRepository.remove(homework);
    
    return { message: 'Homework deleted', error: false };
  }
}
