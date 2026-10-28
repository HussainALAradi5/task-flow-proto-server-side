import { model, Schema } from 'mongoose';
import { ITeamInvitation } from '../../interface/team/TeamInvitation';
import { InvitationStatus } from '../../enums/InvitationStatus';

const schema = new Schema<ITeamInvitation>({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  invitedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(InvitationStatus), default: InvitationStatus.Pending },
}, { timestamps: true });

schema.index({ teamId: 1, invitedUser: 1 }, { unique: true, partialFilterExpression: { status: InvitationStatus.Pending } });

export const TeamInvitation = model<ITeamInvitation>('TeamInvitation', schema);
