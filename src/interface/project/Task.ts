import { Schema } from "mongoose";
import { IBaseEntity } from "../BaseModel";
import { GenericStatus } from "../../enums/project/GenericStatus";
import { TaskPriority } from "../../enums/project/TaskEnum";

export interface ITask extends IBaseEntity {
  title: string;
  description?: string;
  status: GenericStatus
  priority: TaskPriority;
  projectId: Schema.Types.ObjectId;
  milestoneId?: Schema.Types.ObjectId;
  assignTo?: Schema.Types.ObjectId;
  lastAssignTo?: Schema.Types.ObjectId;
}