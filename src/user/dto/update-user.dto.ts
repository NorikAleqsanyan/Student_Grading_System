import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateUserDto {
  @ApiProperty()
  @JoiSchema(Joi.string())
  first_name: string;
  @ApiProperty()
  @JoiSchema(Joi.string())
  last_name: string;
  @ApiProperty()
  @JoiSchema(Joi.number())
  age: number;
  @ApiProperty()
  @JoiSchema(Joi.string())
  phone: string;
}
export class UpdateUserPasswordDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  oldPassword: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  password: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  confirmPassword: string;
}

export class UpdateUserImgDto {
  @ApiProperty()
  @JoiSchema(Joi.string().uri().required())
  image: string;
}