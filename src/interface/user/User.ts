import { Schema } from "mongoose";
import { IBaseEntity } from "../BaseModel";
import { UserRole } from "../../enums/user/UserRoleEnum";

export interface IUser extends IBaseEntity {
  userName: string;
  password?: string;
  email: string;
  mobileNumber?: string;
  teamId?: Schema.Types.ObjectId;
  role: UserRole;
  isActive: boolean;
}