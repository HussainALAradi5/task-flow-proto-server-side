import { Types } from 'mongoose';

export interface ITeamMessage {
  teamId: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  attachment?: string;
  attachmentName?: string;
  mentions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
