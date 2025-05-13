import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validates the user credentials using AuthService.
   * @param username - The username submitted by the client.
   * @param password - The password submitted by the client.
   * @returns The validated user if credentials are correct.
   * @throws UnauthorizedException if validation fails.
   */
  async validate(username: string, password: string): Promise<object> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {

      return { massage: 'Invalid username or password', error: true };
    }

    return user;
  }
}
