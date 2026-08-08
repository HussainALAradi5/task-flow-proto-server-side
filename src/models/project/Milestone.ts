import { Schema, model } from 'mongoose';
import { IMilestone } from '../../interface/project/Milestone';
import { baseSchemaFields } from '../BaseModel';

const milestoneSchema = new Schema<IMilestone>(
  {
    ...baseSchemaFields,
    name: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

export const Milestone = model<IMilestone>('Milestone', milestoneSchema);