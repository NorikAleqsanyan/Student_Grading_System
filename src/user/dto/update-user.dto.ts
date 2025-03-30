import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateUserDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  first_name: string;
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  last_name: string;
  @ApiProperty()
  @JoiSchema(Joi.number().required())
  age: number;
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  phone: string;
}
export class UpdateUserPasswordDto {
  @ApiProperty()
  @JoiSchema(Joi.string().min(8).required())
  oldPassword: string;

  @ApiProperty()
  @JoiSchema(Joi.string().min(8).required())
  password: string;

  @ApiProperty()
  @JoiSchema(Joi.string().min(8).required())
  confirmPassword: string;
}

export class UpdateUserImgDto {
  @ApiProperty()
  @JoiSchema(Joi.string().uri().required())
  image: string;
}