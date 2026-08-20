import { Schema } from "mongoose";
import { IBaseEntity } from "../BaseModel";
import { GenericStatus } from "../../enums/GenericStatus";
import { TaskPriority } from '../../enums/project/TaskPriority';

export interface ITask extends IBaseEntity {
  title: string;
  description?: string;
  status: GenericStatus;
  priority: TaskPriority;
  projectId: Schema.Types.ObjectId;
  milestoneId?: Schema.Types.ObjectId;
  assignTo?: Schema.Types.ObjectId;
  lastAssignTo?: Schema.Types.ObjectId;
  startDate?: Date;
  targetDate?: Date;
  endDate?: Date;
  deliveredDate?: Date;
  lastReviewedBy?: Schema.Types.ObjectId;
  lastReviewedAt?: Date;
  isActive: boolean;
}
