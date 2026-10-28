import { Types } from 'mongoose';
import { InvitationStatus } from '../../enums/InvitationStatus';

export interface ITeamInvitation {
  teamId: Types.ObjectId;
  invitedUser: Types.ObjectId;
  invitedBy: Types.ObjectId;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}
