import { model, Schema, Types } from 'mongoose';

export interface TeamInvitationDocument {
  teamId: Types.ObjectId;
  invitedUser: Types.ObjectId;
  invitedBy: Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<TeamInvitationDocument>({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  invitedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

schema.index({ teamId: 1, invitedUser: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

export const TeamInvitation = model<TeamInvitationDocument>('TeamInvitation', schema);
