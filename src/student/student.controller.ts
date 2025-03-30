import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(@Res() res:Response) {
    try{
      const data = await this.studentService.findAll();
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res:Response) {
    try{
      const data = await this.studentService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
}
