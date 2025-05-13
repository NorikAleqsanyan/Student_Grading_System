import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   * @param username - The username of the user.
   * @param pass - The raw password to compare with the stored hash.
   * @returns The user object without the password if valid, otherwise null.
   */
  async validateUser(username: string, pass: string): Promise<any | null> {
    const user = await this.usersService.findUserByuserName(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generates a JWT access token for the authenticated user.
   * @param user - The user object (already validated).
   * @returns An object containing the JWT access token and user role.
   */
  async login(user: any): Promise<{ access_token: string; role: string }> {
    const payload = {
      userName: user.userName,
      id: user.id,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      image: user.image,
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
