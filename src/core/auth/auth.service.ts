import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../domain/users/users.service';
import { compare } from 'bcrypt';
import { WrongCredentialsExceptionFilter } from '@core/filters/wrong-credentials-exception.filter';
import { AuthUser } from '@core/common/interfaces/auth-user';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject('JwtRefreshService')
    private readonly jwtRefresh: JwtService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  // Called by Local Guard
  async validateUser(email: string, pass: string): Promise<AuthUser> {
    const user = await this.getUserCredentials(email);
    const doesMatch = await compare(pass, user.password);
    if (!doesMatch) throw new WrongCredentialsExceptionFilter();
    delete user.password;
    return {
      user,
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

  async changePassword(id: string, newPassword: string): Promise<any> {
    const hashed = await import('bcrypt').then((b) => b.hash(newPassword, 10));
    return this.userService.findOne({ where: { id } }).then(async (user) => {
      if (!user) throw new UnauthorizedException('Usuário não encontrado');
      await this.userService.updatePassword(id, hashed);
      return { success: true, message: 'Senha alterada com sucesso' };
    });
  }

  async createPassword(
    id: string,
    createPasswordDto: CreatePasswordDto,
  ): Promise<UpdateResult> {
    try {
      const password = createPasswordDto.password;
      const hashed = await import('bcrypt').then((b) => b.hash(password, 10));
      createPasswordDto.password = hashed;
      return await this.userService.createPassword(id, createPasswordDto);
    } catch (error) {
      console.error(error);
    }
  }

  async refreshToken(id: string) {
    try {
      const user = await this.userService.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          profile: true,
        },
      });
      const accessToken = await this.signAccessToken({
        user,
      });
      const refreshToken = await this.signRefreshToken({
        user,
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
    const user = await this.userService.findOne({
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
      },
      {
        subject: user.id.toString(),
      },
    );
  }
}
