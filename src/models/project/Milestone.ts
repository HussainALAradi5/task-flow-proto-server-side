import { Schema, model } from 'mongoose';
import { IMilestone } from '../../interface/project/Milestone';
import { baseSchemaFields } from '../BaseModel';

const milestoneSchema = new Schema<IMilestone>(
  {
    ...baseSchemaFields,
    name: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

milestoneSchema.index({ projectId: 1, name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export const Milestone = model<IMilestone>('Milestone', milestoneSchema);