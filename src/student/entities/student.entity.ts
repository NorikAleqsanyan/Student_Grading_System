import { Grade } from 'src/grade/entities/grade.entity';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryColumn()
  userId: number;

  @Column({nullable:true})
  groupId:number;

  @OneToOne(() => User, u => u.student, {
    onUpdate:"CASCADE",
    onDelete:"CASCADE"
  })

  @JoinColumn()
  user: User;

  @ManyToOne(() => Group, (gr) => gr.student, {
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  })
  group: Group;

  @OneToMany(() => Grade, (grade) => grade.student)
  grade:Grade[];
}