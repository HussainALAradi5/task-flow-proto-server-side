import { Schema } from "mongoose";
import { IBaseEntity } from "./BaseModel";

export interface IEvent extends IBaseEntity {
  title: string;
  description?: string;
  entityType: 'User' | 'Team' | 'Task' | 'Project' | 'Milestone';
  entityId: Schema.Types.ObjectId;
}