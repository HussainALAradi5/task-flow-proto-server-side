import { IBaseEntity } from "../BaseModel";
import { Schema } from 'mongoose';

export interface ITeam extends IBaseEntity {
  name: string;
  description?: string;
  members: Schema.Types.ObjectId[];
  isActive: boolean;
}
