import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessLevel } from '../common/enum/access-level.enum';
import { ROLES_KEY_PROFILE } from '../decorators/profile-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AccessLevel[]>(
      ROLES_KEY_PROFILE,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userRole =
      typeof user.profile === 'string' ? user.profile : undefined;
    return requiredRoles.some((role) => userRole === role);
  }
}
