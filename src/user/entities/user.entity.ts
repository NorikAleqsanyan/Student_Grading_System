import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Column, Entity,  OneToOne,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  age: number;
  @Column({default:0})
  is_verify: number;
  @Column()
  email_token: string;
  @Column()
  role: number;
  @Column()
  phone: string;
  @Column({default:"user.png"})
  image: string;

  @OneToOne(() => Teacher, teach => teach.user)
  teacher:Teacher
  @OneToOne(() => Student, student => student.user)
  student:Student
}