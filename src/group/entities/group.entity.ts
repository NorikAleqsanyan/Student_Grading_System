import { Homework } from "src/homework/entities/homework.entity";
import { Model } from "src/model/entities/model.entity";
import { Student } from "src/student/entities/student.entity";
import { Column,  Entity,  JoinTable,  ManyToMany,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    coursId: number;
    @Column()
    activeModelId: number;
    @Column()
    teachrId: number;

    @ManyToMany(() => Model, (group_model) => group_model.group)
    @JoinTable({
        name: "group_model",
        joinColumn:{name:"groupId", referencedColumnName:"id"},
        inverseJoinColumn:{name:"modelId",referencedColumnName:"id"},
    })
    model:Model[];

    @OneToMany(() => Homework, (homework) => homework.group)
    homework:Homework[];

    @OneToMany(() => Student, (student) => student.group)
    student:Student[];
}
