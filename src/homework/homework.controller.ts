import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new homework assignment' })
  @ApiResponse({ status: 201, description: 'Homework created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  async create(
    @Body() createHomeworkDto: CreateHomeworkDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.homeworkService.create(createHomeworkDto);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a homework assignment' })
  @ApiResponse({ status: 200, description: 'Homework deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      const data = await this.homeworkService.remove(id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
