import { Grade } from "src/grade/entities/grade.entity";
import { Group } from "src/group/entities/group.entity";
import { Model } from "src/model/entities/model.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Homework {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    groupId:number;
    @Column()
    modelId: number;
    @Column()
    title: string;
    @Column()
    body: string;
    @Column()
    data: Date;
    @ManyToOne(() => Group, (gr) => gr.homework, {
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    group: Group;
    @ManyToOne(() => Model, (model) => model.homework, {
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    model: Model;

    @ManyToOne(() => Grade, (grade) => grade.homework ,{
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    grade:Grade;

    @ManyToOne(() => Teacher, (teacher) => teacher.group, {
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    teacher: Teacher;

}
