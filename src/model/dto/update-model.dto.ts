import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema } from 'nestjs-joi';

export class UpdateModelDto {
  @ApiProperty()
  @JoiSchema(Joi.string())
  name: string;

  @ApiProperty()
  @JoiSchema(Joi.string())
  description: string;

  @ApiProperty()
  @JoiSchema(Joi.number().integer())
  courseId: number;
}
