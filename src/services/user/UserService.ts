import { IUser } from '../../interface/user/User';
import { User } from '../../models/user/User';
import { BaseService } from '../BaseService';
import { UserRole } from '../../enums/user/UserRoleEnum';
import bcrypt from 'bcrypt';

class UserServiceClass extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  // Override create to hash passwords securely and assign default MEMBER role
  async create(data: Partial<IUser>): Promise<IUser> {
    let hashedPassword = data.password;
    if (hashedPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(hashedPassword, salt);
    }

    const userData: Partial<IUser> = {
      ...data,
      password: hashedPassword,
      role: data.role || UserRole.MEMBER,
    };

    return await super.create(userData);
  }

  // Explicit authentication lookup function
  async authenticate(email: string, passwordPlain: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email }).select('+password').exec();
    if (!user || !user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  // Role Assignment - Zero 'any' types, natively matches Mongoose UpdateQuery
  async assignRole(userId: string, role: UserRole): Promise<IUser | null> {
    return await this.update(userId, { $set: { role } });
  }

  // Promote to Leader when creating a project context
  async promoteToLeaderForNewProject(userId: string): Promise<IUser | null> {
    const user = await this.getById(userId);
    if (user && user.role === UserRole.MEMBER) {
      return await this.assignRole(userId, UserRole.LEADER);
    }
    return user;
  }
}

export const UserService = new UserServiceClass();