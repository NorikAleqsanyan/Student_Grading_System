import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(@Res() res:Response) {
    try{
      const data = await this.teacherService.findAll();
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res:Response) {
    try{
      const data = await this.teacherService.findOne(id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
}
