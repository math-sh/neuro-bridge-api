import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/domain/users.service';
import { AuthUser } from '../common/interfaces/auth-user';
import { verifyPassword } from '../common/utils/hash';
import { WrongCredentialsException } from '../filters/wrong-credentials-exception.filter';

@Injectable()
export class AuthService {
  constructor(
    @Inject('JwtRefreshService')
    private readonly jwtRefresh: JwtService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  // Called by Local Guard
  async validateUser(email: string, pass: string): Promise<AuthUser> {
    const user = await this.getUserCredentials(email);
    const doesMatch = await verifyPassword(pass, user.password);
    if (!doesMatch) throw new WrongCredentialsException();
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: user.profile,
      mustChangePassword: user.mustChangePassword || false,
    };
  }

  async login(user: AuthUser) {
    try {
      const accessToken = await this.signAccessToken(user);
      const refreshToken = await this.signRefreshToken(user);
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profile: user.profile,
          mustChangePassword: user.mustChangePassword || false,
        },
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async refreshToken(id: string) {
    try {
      const user = await this.userService.findOneOptions({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          profile: true,
          mustChangePassword: true,
        },
      });
      if (!user) throw new UnauthorizedException('User not found');
      const accessToken = await this.signAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        mustChangePassword: user.mustChangePassword || false,
      });
      const refreshToken = await this.signRefreshToken({
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        mustChangePassword: user.mustChangePassword || false,
      });
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          mustChangePassword: user.mustChangePassword || false,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getUserCredentials(email: string) {
    const user = await this.userService.findOneOptions({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        mustChangePassword: true,
        profile: true,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid username or password');
    return user;
  }

  async signAccessToken(user: AuthUser) {
    return await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        mustChangePassword: user.mustChangePassword || false,
      },
      {
        subject: user.id.toString(),
      },
    );
  }

  async signRefreshToken(user: AuthUser) {
    return await this.jwtRefresh.signAsync(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        mustChangePassword: user.mustChangePassword || false,
      },
      {
        subject: user.id.toString(),
      },
    );
  }
}
