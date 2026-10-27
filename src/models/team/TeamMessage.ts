import { model, Schema } from 'mongoose';
import { ITeamMessage } from '../../interface/team/TeamMessage';

const schema = new Schema<ITeamMessage>({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  attachment: { type: String, default: undefined },
}, { timestamps: true });

schema.index({ teamId: 1, createdAt: -1, _id: -1 });

export const TeamMessage = model<ITeamMessage>('TeamMessage', schema);
