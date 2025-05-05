import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Model } from 'src/model/entities/model.entity';
import { Repository } from 'typeorm';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Homework } from './entities/homework.entity';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Model) private modelRepository: Repository<Model>,
  ) {}

  async create(createHomeworkDto: CreateHomeworkDto) {
    const { modelId, groupId } = createHomeworkDto;
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      return { message: 'Group not found', error: true };
    }
    const model = await this.modelRepository.findOneBy({ id: modelId });
    if (!model) {
      return { message: 'Model not found', error: true };
    }
    if (group.activeModelId != model.id) {
      return { message: 'This model is not active in group', error: true };
    }
    return this.homeworkRepository.save({
      ...createHomeworkDto,
      date: new Date(),
    });
  }

  async getHomeworkByGroupAndModel(modelId: number, groupId: number) {
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      return { message: 'Grade not found', error: true };
    }
    const model = await this.modelRepository.findOneBy({ id: modelId });
    if (!model) {
      return { message: 'Model not found', error: true };
    }

    const modelAndGroup = await this.groupRepository
      .createQueryBuilder('group')
      .innerJoinAndSelect('group.model', 'group_model')
      .where('group_model.groupId = groupId', { groupId })
      .andWhere('group_model.modelId = modelId', { modelId })
      .getOne();

    if (modelAndGroup) {
      return { message: 'Group and Model relation not found', error: true };
    }
    return await this.homeworkRepository.find({
      where: { modelId, groupId },
    });
  }

  async remove(id: number) {
    const homework = await this.homeworkRepository.findOne({ where: { id } });
    if (!homework) {
      return { message: 'Homework not found', error: true };
    }
    await this.homeworkRepository.remove(homework);
    return { message: 'Homework delete', error: false };
  }
}
