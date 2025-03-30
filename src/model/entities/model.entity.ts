
import { Course } from "src/course/entities/course.entity";
import { Group } from "src/group/entities/group.entity";
import { Homework } from "src/homework/entities/homework.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Model {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    courseId: number;

    @ManyToOne(() => Course, cours => cours.models, {
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    course: Course;

    @ManyToMany(() => Group,(group) => group.model)
    group:Group;

    @OneToMany(() => Homework, (homework) => homework.model)
    homework:Homework;
}

