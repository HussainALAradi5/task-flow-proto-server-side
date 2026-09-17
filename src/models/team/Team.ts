import { Schema, model } from 'mongoose';
import { ITeam } from '../../interface/team/Team';
import { baseSchemaFields } from '../BaseModel';


const teamSchema = new Schema<ITeam>(
  {
    ...baseSchemaFields,
    name: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Team = model<ITeam>("Team", teamSchema);