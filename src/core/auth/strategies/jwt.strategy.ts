import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from '@core/common/interfaces/auth-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    return {
      id: +payload.sub,
      name: payload.name,
      email: payload.email,
      profileId: +payload.profileId,
      supplierId: +payload.supplierId,
      healthUnitId: +payload.healthUnitId,
      profile: payload.profile,
      permissions: payload.permissions
        ? payload.permissions.map((p: any) => p.id)
        : [],
    };
  }
}
