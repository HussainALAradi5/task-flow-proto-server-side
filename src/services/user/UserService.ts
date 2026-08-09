import { IUser } from '../../interface/user/User';
import { User } from '../../models/user/User';
import { BaseService } from '../BaseService';
import { UserRole } from '../../enums/user/UserRoleEnum';

class UserServiceClass extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const userData: Partial<IUser> = {
      ...data,
      role: data.role || UserRole.MEMBER,
    };
    return await super.create(userData);
  }

  async assignRole(userId: string, role: UserRole): Promise<IUser | null> {
    return await this.update(userId, { role } as any);
  }

  // Automatically elevate user to LEADER when they trigger/create a project context
  async promoteToLeaderForNewProject(userId: string): Promise<IUser | null> {
    const user = await this.getById(userId);
    if (user && user.role === UserRole.MEMBER) {
      return await this.assignRole(userId, UserRole.LEADER);
    }
    return user;
  }
}

export const UserService = new UserServiceClass();