import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { JoiSchema } from "nestjs-joi";


export class UpdateGroupDto {
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    name: string;
}
export class UpdateGroupModelDto {
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    activeModelId:number
}
export class UpdateGroupTeacherDto {
    @ApiProperty()
    @JoiSchema(Joi.number().integer().required())
    teachrId:number
}
