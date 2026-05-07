export interface AuthUser {
  id: string;
  email: string;
  name: string;
  mustChangePassword?: boolean;
  profile: string;
  parentsId?: string;
  childrenId?: string;
}
