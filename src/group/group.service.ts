import { Injectable } from '@nestjs/common';
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

/**
 * Service for managing groups.
 */
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Model) private modelRepository: Repository<Model>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  /**
   * Creates a new group.
   *
   * @param {CreateGroupDto} createGroupDto - The data for creating the group.
   * @returns {Promise<Group | { message: string, error: boolean }>}
   * - Returns the created group if successful, or an error message if group, model, course, or teacher is not found.
   */
  async create(createGroupDto: CreateGroupDto): Promise<Group | {
    message: string;
    error: boolean;
  }> {
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

    return this.groupRepository.save({
      name,
      activeModelId,
      coursId,
      teacherId,
    });
  }

  /**
   * Retrieves all groups.
   *
   * @returns {Promise<Group[]>} List of all groups, including students, models, and teachers.
   */
  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find({
      relations: {
        students: {
          user: true,
        },
        model: true,
        teacher: {
          user: true,
        },
      },
    });
  }

  /**
   * Retrieves a group by its ID.
   *
   * @param {number} id - The ID of the group.
   * @returns {Promise<Group | { message: string, error: boolean }>}
   * - Returns the group if found, or an error message if not found.
   */
  async findOne(id: number): Promise<Group | {
    message: string;
    error: boolean;
  }> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: {
        students: true,
        model: true,
        teacher: {
          user: true,
        },
      },
    });
    if (!group) {
      
      return { message: 'Group not found', error: true };
    }
    
    return group;
  }

  /**
   * Updates a group's details.
   *
   * @param {number} id - The ID of the group to update.
   * @param {UpdateGroupDto} updateGroupDto - The updated data for the group.
   * @returns {Promise<{ message: string, error: boolean }>}
   * - Returns a success message if updated, or an error message if group name already exists or group is not found.
   */
  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<{
    message: string;
    error: boolean;
  }> {
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

  /**
   * Updates the active model for a group.
   *
   * @param {number} id - The ID of the group to update.
   * @param {UpdateGroupModelDto} updateGroupModelDto - The updated model data for the group.
   * @returns {Promise<{ message: string, error: boolean }>}
   * - Returns a success message if updated, or an error message if group or model is not found.
   */
  async updateGroupModel(id: number, updateGroupModelDto: UpdateGroupModelDto): Promise<{
    message: string;
    error: boolean;
  }> {
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

  /**
   * Updates the teacher for a group.
   *
   * @param {number} id - The ID of the group to update.
   * @param {UpdateGroupTeacherDto} updateGroupTeacherDto - The updated teacher data for the group.
   * @returns {Promise<{ message: string, error: boolean }>}
   * - Returns a success message if updated, or an error message if group or teacher is not found.
   */
  async updateGroupTeacher(
    id: number,
    updateGroupTeacherDto: UpdateGroupTeacherDto,
  ): Promise<{
    message: string;
    error: boolean;
  }> {
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

    await this.groupRepository.update(id, { teacherUserId: teacherId });
    
    return { message: 'Group Teacher update.', error: false };
  }

  /**
   * Deletes a group by its ID.
   *
   * @param {number} id - The ID of the group to remove.
   * @returns {Promise<{ message: string, error: boolean }>}
   * - Returns a success message if deleted, or an error message if group has students or not found.
   */
  async remove(id: number): Promise<{
    message: string;
    error: boolean;
  }> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: { students: true },
    });
    if (!group) {
      
      return { message: 'Group not found', error: true };
    }

    if (group.students.length) {
      
      return {
        message: 'This group already has students.',
        error: true,
      };
    }

    await this.groupRepository.remove(group);

    return { message: 'Group deleted', error: false };
  }
}
