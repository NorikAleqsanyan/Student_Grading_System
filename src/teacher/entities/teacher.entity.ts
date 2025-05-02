import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, user => user.teacher, {
    onUpdate:"CASCADE",
    onDelete:"CASCADE"
  })
  user: User;

  @OneToMany(() => Group, (group) => group.homework)
  group:Group[];
}
