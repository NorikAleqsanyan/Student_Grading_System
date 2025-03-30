import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserImgDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { promises as fs } from 'fs';
import path from 'path';




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
      return new BadRequestException('User not found with that email' );
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
    if (role == 1) {
      await this.teacherRepository.save({ user });
    }else if (role == 0) {
      await this.studentRepository.save({ user });
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({  where:{id} });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    return await this.userRepository.save(updateUserDto);
  }

  async updateImage(id: number, updateUserImgDto: UpdateUserImgDto) {
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    if (updatedUser.image) {
      const filePath = path.join(__dirname, '..', 'uploads', updatedUser.image);
        await fs.unlink(filePath);
    }
    return await this.userRepository.save(updateUserImgDto);
  }

  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { oldPassword, password, confirmPassword } = updateUserPasswordDto;

    if (!oldPassword || !password || !confirmPassword) {
      throw new BadRequestException('All password fields are required!');
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found!');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect!');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully', user };
  }



  async remove(id: number) {
    const us = await this.userRepository.findOne({ where: { id } });
    if (!us) {
      return false;
    }
    await this.userRepository.remove(us);
    return true;
  }
}
