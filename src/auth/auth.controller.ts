import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, LoginUser } from 'src/user/dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HasRoles } from './has-roles.decorator';
import { Role } from 'src/user/role/user.enum';
import { RolesGuard } from './roles.guard';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private usersService: UserService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post("registr")
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and retrieve token' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() login: LoginUser, @Res() res: Response) {
    try {
      const data = await this.authService.login(req.user);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profile information' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('profile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const data = await req.user;
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get admin information' })
  @ApiResponse({ status: 200, description: 'Admin information retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('admin')
  async onlyAdmin(@Request() req, @Res() res: Response) {
    try {
      const data = await req.user;
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.TEACHER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get teacher information' })
  @ApiResponse({ status: 200, description: 'Teacher information retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('teacher')
  async onlyTeacher(@Request() req, @Res() res: Response) {
    try {
      const data = await req.user;
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HasRoles(Role.STUDENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get student information' })
  @ApiResponse({ status: 200, description: 'Student information retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('student')
  async onlyStudent(@Request() req, @Res() res: Response) {
    try {
      const data = await req.user;
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
