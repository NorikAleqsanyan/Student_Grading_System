import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { TeacherService } from './teacher.service';

@ApiTags('Teachers')
@ApiBearerAuth('JWT-auth')
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, description: 'Teachers retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(@Res() res: Response) {
    try {
      const data = await this.teacherService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findOne(@Param('id') id: number, @Res() res: Response) {
    try {
      const data = await this.teacherService.findOne(id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
