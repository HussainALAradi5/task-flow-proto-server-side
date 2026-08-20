import { Schema, model } from 'mongoose';
import { baseSchemaFields } from '../BaseModel';
import { IProject } from '../../interface/project/Project';


const projectSchema = new Schema<IProject>(
  {
    ...baseSchemaFields,
    title: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  },
  { timestamps: true }
);

export const Project = model<IProject>('Project', projectSchema);