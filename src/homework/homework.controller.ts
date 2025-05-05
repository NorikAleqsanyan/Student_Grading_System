import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/role/user.enum';
import { Response } from 'express';

@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(@Body() createGroupDto: CreateHomeworkDto, @Res() res:Response) {
    try{
      const data = await this.homeworkService.create(createGroupDto);
      return res.status(HttpStatus.CREATED).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }



  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':groupId/:modelId')
  async  getHomeworkByGroupAndModel(@Param('groupId') groupId: number,@Param('modelId') modelId: number, @Res() res:Response) {
    try{
      const data = await this.homeworkService.getHomeworkByGroupAndModel(groupId, modelId);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }



  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async remove(@Param('id') id: number,@Res() res:Response) {
    try{
      const data = await this.homeworkService.remove(id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
}
