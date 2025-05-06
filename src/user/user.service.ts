import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { promises as fs } from 'fs';
import path from 'path';
import { Role } from './role/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { first_name, last_name, age, email, password, phone, role } =
      createUserDto;
    const us = await this.userRepository.findOneBy({ email });
    if (us) {
      return { message: 'User alredy this email', error: true };
    }
    const user = await this.userRepository.save({
      first_name,
      last_name,
      age,
      email,
      password: bcrypt.hashSync(password, 10),
      phone,
      role,
    });

    if (role == Role.STUDENT) {
      await this.studentRepository.save({ userId: user.id });
    } else if (role == Role.TEACHER) {
      await this.teacherRepository.save({
        userId: user.id,
      });
    }

    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findAll() {
    return await this.userRepository.find({
      where: { role: In([0, 1]) },
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id, role: In([0, 1]) } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    if (!updatedUser) {
      return { message: 'User not found', error: true };
    }

    await this.userRepository.update(id, updateUserDto);

    return { message: 'ok' };
  }

  async updateImage(id: number, newImage: string) {
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      return { message: 'User not found', error: true };
    }
    if (updatedUser.image && updatedUser.image != 'user.png') {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        updatedUser.image,
      );
      console.log(__dirname, filePath);
      fs.unlink(filePath);
    }
    await this.userRepository.update(id, { image: newImage });

    return await this.userRepository.findOne({ where: { id } });
  }
  async updatePassword(
    id: number,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const { oldPassword, password, confirmPassword } = updateUserPasswordDto;

    if (!oldPassword || !password || !confirmPassword) {
      return { message: 'All password fields are required!', error: true };
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return { message: 'User not found!', error: true };
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return { message: 'Old password is incorrect!', error: true };
    }

    if (password !== confirmPassword) {
      return {
        message: 'New password and confirmation do not match!',
        error: true,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully', user };
  }

  async remove(id: number) {
    const us = await this.userRepository.findOne({ where: { id } });
    if (!us) {
      return { message: 'User not found!', error: true };
    }
    await this.userRepository.remove(us);

    return { message: 'User Delete', error: true };
  }
}
