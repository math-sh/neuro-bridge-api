export interface AuthUser {
  id: string;
  email: string;
  name: string;
  profile: string;
  parentsId?: string;
  childrenId?: string;
}
