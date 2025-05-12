import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class CreateModelDto {
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  name: string;

  @ApiProperty()
  @JoiSchema(Joi.string().required())
  description: string;

  @ApiProperty()
  @JoiSchema(Joi.number().integer().required())
  courseId: number;
}
