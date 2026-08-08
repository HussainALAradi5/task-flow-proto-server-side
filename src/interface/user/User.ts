import { Schema } from "mongoose";
import { IBaseEntity } from "../BaseModel";

export interface IUser extends IBaseEntity {
  userName: string;
  password?: string;
  email: string;
  mobileNumber?: string;
  teamId?: Schema.Types.ObjectId;
  role: 'Admin' | 'Leader' | 'Member';
  isActive: boolean;
}