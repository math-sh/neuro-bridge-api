import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../../common/interfaces/auth-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      profile: payload.profile,
      parentsId: payload.parentsId,
      childrenId: payload.childrenId,
    };
  }
}
