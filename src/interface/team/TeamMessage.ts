import { Types } from 'mongoose';

export interface ITeamMessage {
  teamId: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  attachment?: string;
  createdAt: Date;
  updatedAt: Date;
}
