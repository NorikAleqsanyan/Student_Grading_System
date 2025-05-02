import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Model } from 'src/model/entities/model.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  UpdateGroupDto,
  UpdateGroupModelDto,
  UpdateGroupTeacherDto,
} from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Model) private modelRepository: Repository<Model>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const { name, activeModelId, coursId, teacherId } = createGroupDto;
    const extingGroup = await this.groupRepository.findOne({
      where: { name: name },
    });
    if (extingGroup) {
      return { message: 'Group name already exists', error: true };
    }
    const activeModel = await this.modelRepository.findOne({
      where: { id: activeModelId },
    });
    if (!activeModel) {
      return { message: 'Active Model not found', error: true };
    }
    const cours = await this.courseRepository.findOne({
      where: { id: coursId },
    });
    if (!cours) {
      return { message: 'Course not found', error: true };
    }
    const teacher = await this.teacherRepository.findOne({
      where: { userId: teacherId },
    });
    if (!teacher) {
      return { message: 'Teacher not found', error: true };
    }
    return this.groupRepository.save(createGroupDto);
  }

  async findAll() {
    return await this.groupRepository.find({ relations: ['student'] });
  }

  async findOne(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: {
        students: true,
        model: true,
        teacher: true,
      },
    });
    if (!group) {
      return { message: 'Group not found', error: true };
    }
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const { name } = updateGroupDto;
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      return { message: 'Group not found', error: true };
    }
    const extingGroup = await this.groupRepository.findOne({
      where: { name: name },
    });
    if (extingGroup) {
      return { message: 'Group name already exists', error: true };
    }
    await this.groupRepository.update(id, updateGroupDto);

    return { message: 'Group name update.', error: false };
  }

  async updateGroupModel(id: number, updateGroupModelDto: UpdateGroupModelDto) {
    const { activeModelId } = updateGroupModelDto;
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      return { message: 'Group not found', error: true };
    }

    const activeModel = await this.modelRepository.findOne({
      where: { id: activeModelId },
    });
    if (!activeModel) {
      return { message: 'Active Model not found', error: true };
    }

    await this.groupRepository.update(id, updateGroupModelDto);

    return { message: 'Group Model update.', error: false };
  }
  async updateGroupTeacher(
    id: number,
    updateGroupTeacherDto: UpdateGroupTeacherDto,
  ) {
    const { teacherId } = updateGroupTeacherDto;
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      return { message: 'Group not found', error: true };
    }

    const teacher = await this.teacherRepository.findOne({
      where: { userId: teacherId },
    });
    if (!teacher) {
      return { message: 'Teacher not found', error: true };
    }

    await this.groupRepository.update(id, { teacherId: teacherId });

    return { message: 'Group Teacher update.', error: false };
  }

  async remove(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: { students: true },
    });
    if (!group) {
      return { message: 'Group not found', error: true };
    }
    if (group.students.length) {
      return {
        message: 'This group alredy student.',
      };
    }
    await this.groupRepository.remove(group);
    return { message: 'Group delete.', error: false };
  }
}
