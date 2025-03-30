import { Homework } from "src/homework/entities/homework.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, ManyToOne,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    studentId: number;
    @Column()
    homeworkId: number;
    @Column()
    rate: number;
    
    @ManyToOne(() => Homework, (homework) => homework.grade, {
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    homework:Homework;

    @ManyToOne(() => Student, (student) => student.grade, {
        onDelete:"CASCADE",
        onUpdate:"CASCADE"
    })
    student:Student;


}
