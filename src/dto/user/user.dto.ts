import { UserRole } from '../../enums/user/UserRole';

export interface CreateUserDto {
  userName: string;
  email: string;
  password: string;
  mobileNumber?: string;
}

export interface UpdateUserDto {
  userName?: string;
  email?: string;
  mobileNumber?: string;
  teamId?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateRoleDto {
  role: UserRole;
}
