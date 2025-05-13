import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/user.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiResponse({ status: 201, description: 'Grade created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  async create(@Body() createGradeDto: CreateGradeDto, @Res() res: Response) {
    try {
      const data = await this.gradeService.create(createGradeDto);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an existing grade' })
  @ApiResponse({ status: 200, description: 'Grade updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.gradeService.update(+id, updateGradeDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a grade' })
  @ApiResponse({ status: 200, description: 'Grade deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.gradeService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.TEACHER,Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get grades by group and model ID' })
  @ApiResponse({ status: 200, description: 'Grades retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get(':groupId/:modelId')
  async getGradedByModelId(
    @Param('groupId') groupId: number,
    @Param('modelId') modelId: number,
    @Res() res: Response,
  ) {
    try {
      const data = await this.gradeService.getGradedByModelId(groupId, modelId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
