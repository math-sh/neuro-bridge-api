import { SetMetadata } from '@nestjs/common';
import { AccessLevel } from '../common/enum/access-level.enum';

export const ROLES_KEY_PROFILE = 'roles';
export const Roles = (...roles: AccessLevel[]) =>
  SetMetadata(ROLES_KEY_PROFILE, roles);
