import { IUser } from '../../interface/user/User';
import { User } from '../../models/user/User';
import { BaseService } from '../BaseService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';
import { UserRole } from '../../enums/user/UserRole';
import bcrypt from 'bcrypt';

class UserServiceClass extends BaseService<IUser> {
  constructor() {
    super(User);
  }

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

    const user = await super.create(userData);
    await EventService.logEvent('User created', EntityType.USER, user.id, `New user: ${user.userName}`, data.createdBy?.toString());
    return user;
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const updated = await super.update(id, data);
    if (updated) {
      await EventService.logEvent('User updated', EntityType.USER, id, 'User profile updated', id);
    }
    return updated;
  }

  async authenticate(identifier: string, passwordPlain: string): Promise<IUser | null> {
    const user = await this.model.findOne({
      $or: [{ email: identifier }, { userName: identifier }, { mobileNumber: identifier }],
    }).select('+password').exec();
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    return isMatch ? user : null;
  }

  async findByEmailOrUsername(email: string, userName: string): Promise<IUser | null> {
    return await this.model.findOne({ $or: [{ email }, { userName }] }).exec();
  }

  async assignRole(userId: string, role: UserRole): Promise<IUser | null> {
    const updated = await this.model.findByIdAndUpdate(userId, { role }, { new: true }).exec();
    if (updated) {
      await EventService.logEvent('User role updated', EntityType.USER, userId, `Role changed to ${role}`, userId);
    }
    return updated;
  }

  async promoteToLeaderForNewProject(userId: string): Promise<IUser | null> {
    const user = await this.getById(userId);
    if (user && user.role === UserRole.MEMBER) {
      return await this.assignRole(userId, UserRole.LEADER);
    }
    return user;
  }
}

export const UserService = new UserServiceClass();