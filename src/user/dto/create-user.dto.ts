import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
export class CreateUserDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  first_name: string;
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  last_name:string
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  email: string;
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  password:string
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  confirm_password:string
  @ApiProperty()
  @JoiSchema(Joi.number().integer().required())
  age: number;
  @ApiProperty()
  @JoiSchema(Joi.number().integer().min(0).max(1).required())
  role: number;
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  phone:string
}


export class LoginUser{
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    username:string
    @ApiProperty()
    @JoiSchema(Joi.string().min(4).max(20).required())
    password:string
}