import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class CreateGroupDto {
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    name: string;
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    coursId:number
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    activeModelId:number
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    teacherId:number
}
