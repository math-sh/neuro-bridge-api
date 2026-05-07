import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../domain/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { JwtRefreshModule } from './jwt-refresh/jwt-refresh.module';
import { JwtMailStrategy } from './strategies/jwt-mail.strategy';
import { MailService } from '@core/common/services/mail/mail.service';
import { JwtMailModule } from './jwt-mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ defaultStrategy: 'local' }),
    UsersModule,
    TypeOrmModule.forFeature([SystemSetting]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'),
        },
        secret: configService.get<string>('jwt.accessSecret'),
      }),
    }),
    JwtRefreshModule,
    JwtMailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtMailStrategy,
    MailService,
  ],
})
export class AuthModule {}
