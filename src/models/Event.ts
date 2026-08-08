import { model, Schema } from "mongoose";
import { IEvent } from "../interface/Event";
import { baseSchemaFields } from "./BaseModel";

const eventSchema = new Schema<IEvent>(
  {
    ...baseSchemaFields,
    title: { type: String, required: true },
    description: { type: String, default: '' },
    entityType: { 
      type: String, 
      enum: ['User', 'Team', 'Task', 'Project', 'Milestone'], 
      required: true 
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const Event = model<IEvent>('Event', eventSchema);