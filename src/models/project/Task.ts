import { model, Schema } from "mongoose";
import { ITask } from "../../interface/project/Task";
import { baseSchemaFields } from "../BaseModel";
import { GenericStatus } from "../../enums/GenericStatus";
import { TaskPriority } from '../../enums/project/TaskPriority';

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
    startDate: { type: Date, default: null },
    targetDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    deliveredDate: { type: Date, default: null },
    lastReviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    lastReviewedAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

taskSchema.index({ projectId: 1, title: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export const Task = model<ITask>("Task", taskSchema);
