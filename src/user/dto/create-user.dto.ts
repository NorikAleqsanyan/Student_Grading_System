import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';
import { min } from 'rxjs';
export class CreateUserDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  first_name: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  last_name:string;

  @ApiProperty()
  @JoiSchema(Joi.string().min(6).required())
  userName: string;

  @ApiProperty()
  @JoiSchema(Joi.string().min(6).required())
  password:string;

  @ApiProperty()
  @JoiSchema(Joi.string().min(6).required())
  confirm_password:string;

  @ApiProperty()
  @JoiSchema(Joi.number().min(7).integer().required())
  age: number;

  @ApiProperty()
  @JoiSchema(Joi.number().integer().min(0).max(1).required())
  role: number;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  phone:string;
  
}


export class LoginUser{
    @ApiProperty()
    @JoiSchema(Joi.string().min(6).required())
    username:string
    @ApiProperty()
    @JoiSchema(Joi.string().min(6).max(20).required())
    password:string
}