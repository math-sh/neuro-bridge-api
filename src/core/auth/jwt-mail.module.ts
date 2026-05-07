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
          expiresIn: configService.get<string>('jwt.mailExpiresIn'),
        },
        secret: configService.get<string>('jwt.mailSecret'),
      }),
    }),
  ],
  providers: [
    {
      provide: 'JwtMailService',
      useExisting: JwtService,
    },
  ],
  exports: ['JwtMailService'],
})
export class JwtMailModule {}
