import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('jwt.refreshExpiresIn'),
        },
        secret: configService.get<string>('jwt.refreshSecret'),
      }),
    }),
  ],
  providers: [
    {
      provide: 'JwtRefreshService',
      useExisting: JwtService,
    },
  ],
  exports: ['JwtRefreshService'],
})
export class JwtRefreshModule {}
