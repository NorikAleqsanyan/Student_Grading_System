import { Controller, Get,  Body, Patch, Param, Delete, UseGuards, Res, HttpStatus, Req, UseInterceptors, UploadedFile} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto,  UpdateUserPasswordDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/uploud/config';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll(@Res() res:Response) {
    try{
      const data = await this.userService.findAll();
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
      const data = await this.userService.findOne(id);
      return res.status(HttpStatus.OK).json(data)
    }catch(e){
      return res.status(HttpStatus.BAD_REQUEST).json({message:e.message})
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user information' })
  @Patch(':id/update')
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.update(req.user.id, updateUserDto);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user password' })
  @Patch(':id/password')
  async updatePassword(
    @Req() req,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.updatePassword(
        req.user.id,
        updateUserPasswordDto,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user profile image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Patch('image')
  async updateImage(
    @Req() req,
    @UploadedFile() file,
    @Res() res: Response
  ) {
    try {
      const data = await this.userService.updateImage(req.user.id, file.filename);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @Delete(':id')
  async remove(@Req() req, @Res() res: Response) {
    try {
      const data = await this.userService.remove(req.user.id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
