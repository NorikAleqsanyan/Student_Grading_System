import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class CreateGradeDto {
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    homeworkId: number;
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    studentId: number;
    @ApiProperty()
    @JoiSchema(Joi.number().integer().min(0).max(10).required())
    rate: number;
}
