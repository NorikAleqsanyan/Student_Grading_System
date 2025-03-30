import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class CreateHomeworkDto {
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    groupId: number;
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    modelId:number
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    title:string
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    body:string
}
