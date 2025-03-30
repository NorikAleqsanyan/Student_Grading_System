import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto, UpdateGroupModelDto, UpdateGroupTeacherDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const { name } =
    createGroupDto;
    const extingGroup = await this.groupRepository.
    createQueryBuilder("group")
    .where('LOWER(group.name) = LOWER(:name)',{name})
    .getOne()
    if (extingGroup) {
      return new BadRequestException( "Group name already exists" );
    }
    return this.groupRepository.save(createGroupDto);
  }

  async findAll() {
    return await this.groupRepository.find();
  }

  async findOne(id: number) {
    const group = await this.groupRepository.findOne({ where: { id } , relations:{
      model:true
    }});
    if (!group) {
      return new BadRequestException("Group not found"); 
    }
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const {name} =  updateGroupDto
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
       throw new BadRequestException("Group not found") 
    }
    const extingGroup = await this.groupRepository.
    createQueryBuilder("group")
    .where('LOWER(group.name) = LOWER(:name)',{name})
    .getOne()
    if (extingGroup) {
      throw new BadRequestException("Group name already exists") 
    }
    return await this.groupRepository.update(id, updateGroupDto);
  }

  async updateGroupModel(id: number, updateGroupModelDto: UpdateGroupModelDto) {
    const {activeModelId} =  updateGroupModelDto
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
       throw new BadRequestException("Group not found") 
    }

    return await this.groupRepository.update(id,updateGroupModelDto);
  }
  async updateGroupTeacher(id: number, updateGroupTeacherDto: UpdateGroupTeacherDto) {
    const {teachrId} =  updateGroupTeacherDto
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
       throw new BadRequestException("Group not found") 
    }

    return await this.groupRepository.update(id,updateGroupTeacherDto);
  }

  async remove(id: number) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      return false;
    }  
    await this.groupRepository.remove(group);
    return true
  }
}
