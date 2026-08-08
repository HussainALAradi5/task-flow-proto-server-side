import { model, Schema } from "mongoose";
import { ITask } from "../../interface/project/Task";
import { baseSchemaFields } from "../BaseModel";
import { GenericStatus } from "../../enums/project/GenericStatus";
import { TaskPriority } from "../../enums/project/TaskEnum";

const taskSchema = new Schema<ITask>(
  {
    ...baseSchemaFields,
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(GenericStatus),
      default: GenericStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
      default: null,
    },
    assignTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    lastAssignTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export const Task = model<ITask>("Task", taskSchema);
