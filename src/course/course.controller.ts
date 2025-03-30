import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/role/user.enum';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto, @Res() res:Response) {
    try{
      const data = await this.courseService.create(createCourseDto);
      return res.status(HttpStatus.CREATED).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
   }
   @UseGuards(AuthGuard('jwt'))
   @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll( @Res() res:Response) {
    try{
      const data = await this.courseService.findAll();
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string,@Res() res:Response) {
    try{
      const data = await this.courseService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Res() res:Response) {
    try{
      const data = await this.courseService.update(+id, updateCourseDto);
      return res.status(HttpStatus.CREATED).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res:Response) {
    try{
      const data = await this.courseService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }
}
