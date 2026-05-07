import { AccessLevel } from '@core/common/enum/access-level.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY_PROFILE = 'roles';
export const Roles = (...roles: AccessLevel[]) =>
  SetMetadata(ROLES_KEY_PROFILE, roles);
