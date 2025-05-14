import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { promises as fs, promises } from 'fs';
import path from 'path';
import { Role } from './role/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  /**
   * Creates a new user and links them to a Student or Teacher entity based on role.
   * @param createUserDto - User creation data
   * @returns The created user or an error message if the username already exists
   */
  async create(createUserDto: CreateUserDto):Promise<object> {
    const { first_name, last_name, age, userName, password, phone, role } =
      createUserDto;
    const us = await this.userRepository.findOneBy({ userName });
    if (us) {

      return { message: 'User already exists with this userName', error: true };
    }

    const user = await this.userRepository.save({
      first_name,
      last_name,
      age,
      userName,
      password: bcrypt.hashSync(password, 10),
      phone,
      role,
    });

    if (role == Role.STUDENT) {
      await this.studentRepository.save({ userId: user.id });
    } else if (role == Role.TEACHER) {
      await this.teacherRepository.save({ userId: user.id });
    }

    return user;
  }

  /**
   * Finds a user by their username.
   * @param userName - Username to search
   * @returns The user if found
   */
  async findUserByuserName(userName: string):Promise<object | null> {

   return await this.userRepository.findOneBy({ userName });
  }

  /**
   * Retrieves all users with roles STUDENT or TEACHER.
   * @returns Array of users
   */
  async findAll():Promise<object | null> {

    return await this.userRepository.find({
      where: { role: In([0, 1]) },
    });
  }

  /**
   * Finds one user by ID if they are a student or teacher.
   * @param id - User ID
   * @returns The user if found
   */
  async findOne(id: number):Promise<object | null> {

    return await this.userRepository.findOne({ where: { id, role: In([0, 1]) } });
  }

  /**
   * Updates user data.
   * @param id - User ID
   * @param updateUserDto - Updated user information
   * @returns Success message or error if user is not found
   */
  async update(id: number, updateUserDto: UpdateUserDto):Promise<object> {
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    if (!updatedUser) {

      return { message: 'User not found', error: true };
    }

    await this.userRepository.update(id, updateUserDto);

    return { message: 'ok' };
  }

  /**
   * Updates the user's profile image and deletes the old one if it's not the default.
   * @param id - User ID
   * @param newImage - New image filename
   * @returns Updated user or error if not found
   */
  async updateImage(id: number, newImage: string):Promise<object | null> {
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {

      return { message: 'User not found', error: true };
    }
    if (updatedUser.image && updatedUser.image !== 'user.png') {
      const filePath = path.join(__dirname, '..', '..', 'uploads', updatedUser.image);
      fs.unlink(filePath);
    }
    await this.userRepository.update(id, { image: newImage });

    return await this.userRepository.findOne({ where: { id } });
  }

  /**
   * Updates the user's password after validating the old password and matching confirmation.
   * @param id - User ID
   * @param updateUserPasswordDto - Password update data
   * @returns Success or error message
   */
  async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto):Promise<object> {
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

  /**
   * Removes a user by ID.
   * @param id - User ID
   * @returns Success or error message
   */
  async remove(id: number):Promise<object> {
    const us = await this.userRepository.findOne({ where: { id } });
    if (!us) {
      
      return { message: 'User not found!', error: true };
    }
    await this.userRepository.remove(us);

    return { message: 'User deleted', error: true };
  }
}
