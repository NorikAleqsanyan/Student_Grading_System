import { Model } from "src/model/entities/model.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @OneToMany(() => Model, model => model.course)
    models: Model;
}
