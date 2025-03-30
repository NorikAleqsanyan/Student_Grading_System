import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class UpdateGradeDto{
    @ApiProperty()
    @JoiSchema(Joi.number().integer().min(0).max(10).required())
    rate: number;
}
