import { Schema } from "mongoose";
import { IBaseEntity } from "../BaseModel";

export interface IMilestone extends IBaseEntity {
  name: string;
  projectId: Schema.Types.ObjectId;
  isActive: boolean;
}