import { Schema } from "mongoose";
import { IBaseEntity } from "../BaseModel";

export interface IProject extends IBaseEntity {
  title: string;
  description?: string;
  teamId?: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  isActive: boolean;
}
