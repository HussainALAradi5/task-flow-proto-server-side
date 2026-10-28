import { BaseController } from '../BaseController';
import { ITeam } from '../../interface/team/Team';
import { TeamService } from '../../services/team/TeamService';
import { catchAsync } from '../../utilities/catchAsync';
import { Request, Response } from 'express';
import { buildMemberScopeFilter, parseParamId } from '../../utilities/helpers';
import { getPaginationParams } from '../../utilities/pagination';
import { QueryFilter } from 'mongoose';
import { Team } from '../../models/team/Team';
import { User } from '../../models/user/User';
import { Project } from '../../models/project/Project';
import { IProject } from '../../interface/project/Project';
import { EventService } from '../../services/EventService';
import { EntityType } from '../../enums/EntityType';
import { TeamInvitation } from '../../models/team/TeamInvitation';
import { NotificationService } from '../../services/NotificationService';
import { InvitationDecision } from '../../enums/InvitationDecision';
import { InvitationStatus } from '../../enums/InvitationStatus';

class TeamControllerClass extends BaseController<ITeam> {
  constructor() {
    super(TeamService);
  }

  createTeam = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const team = await TeamService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: team });
  });

  updateTeam = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const team = await Team.findById(id);
    if (!team?.isActive || team.createdBy?.toString() !== req.user!.id) {
      res.status(404).json({ status: 'error', message: 'Team not found' }); return;
    }
    const updated = await TeamService.update(id, req.body, req.user!.id);
    res.status(200).json({ status: 'success', data: updated });
  });

  deleteTeam = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const team = await Team.findById(id);
    if (!team?.isActive || team.createdBy?.toString() !== req.user!.id) {
      res.status(404).json({ status: 'error', message: 'Team not found' }); return;
    }
    await TeamService.softDelete(id, req.user!.id);
    res.status(200).json({ status: 'success', message: 'Team deactivated successfully' });
  });

  override getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await TeamService.getAllPaginated(
      buildMemberScopeFilter(req.user!) as QueryFilter<ITeam>,
      getPaginationParams(req),
      typeof req.query.search === 'string' ? req.query.search : undefined,
      undefined,
      req.query.exactMatch === 'true',
      req.query.includeInactive === 'true',
    );
    res.status(200).json({ status: 'success', ...result });
  });

  addMember = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const team = await Team.findById(id);
    if (!team?.isActive || team.createdBy?.toString() !== req.user!.id) {
      res.status(404).json({ status: 'error', message: 'Team not found' }); return;
    }
    const email = (req.body.email as string).trim().toLowerCase();
    const exactEmail = new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    const user = await User.findOne({ email: exactEmail, isActive: true });
    if (!user) { res.status(404).json({ status: 'error', message: 'No active account has that email. Ask them to sign up first.' }); return; }
    if (team.createdBy?.toString() === user.id) {
      res.status(409).json({ status: 'error', message: 'This person already owns the team' }); return;
    }
    if (team.members.some((member) => member.toString() === user.id)) {
      res.status(409).json({ status: 'error', message: 'This person is already a team member' }); return;
    }
    const existing = await TeamInvitation.findOne({ teamId: team._id, invitedUser: user._id, status: InvitationStatus.Pending });
    if (existing) { res.status(409).json({ status: 'error', message: 'An invitation is already pending' }); return; }
    await TeamInvitation.create({ teamId: team._id, invitedUser: user._id, invitedBy: req.user!.id, status: InvitationStatus.Pending });
    try { await NotificationService.invitation(user.id, team.name); }
    catch (error) { console.error('Could not create invitation notification', error); }
    await EventService.logEvent('Team invitation sent', EntityType.TEAM, id, `Invited ${user.userName}`, req.user!.id);
    res.status(202).json({ status: 'success', message: 'Invitation sent to their TaskFlow account' });
  });

  pendingInvitations = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const invitations = await TeamInvitation.find({ invitedUser: req.user!.id, status: InvitationStatus.Pending })
      .populate('teamId', 'name isActive').populate('invitedBy', 'userName').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: invitations.filter((item) => item.teamId && (item.teamId as unknown as { isActive?: boolean }).isActive !== false) });
  });

  respondToInvitation = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const invitationId = parseParamId(req, 'invitationId');
    const invitation = await TeamInvitation.findOne({ _id: invitationId, invitedUser: req.user!.id, status: InvitationStatus.Pending });
    if (!invitation) { res.status(404).json({ status: 'error', message: 'Invitation not found' }); return; }
    const team = await Team.findById(invitation.teamId);
    if (!team?.isActive) { res.status(404).json({ status: 'error', message: 'Team not found' }); return; }
    const status = req.body.decision === InvitationDecision.Accept ? InvitationStatus.Accepted : InvitationStatus.Declined;
    const changed = await TeamInvitation.findOneAndUpdate({ _id: invitationId, status: InvitationStatus.Pending }, { status }, { returnDocument: 'after' });
    if (!changed) { res.status(409).json({ status: 'error', message: 'Invitation already answered' }); return; }
    if (status === InvitationStatus.Accepted) {
      await Team.updateOne({ _id: team._id }, { $addToSet: { members: req.user!.id } });
      await Project.updateMany({ teamId: team._id, isActive: true } as unknown as QueryFilter<IProject>, { $addToSet: { members: req.user!.id } });
    }
    await EventService.logEvent(`Team invitation ${status}`, EntityType.TEAM, team.id, `${req.user!.userName} ${status} the invitation`, req.user!.id);
    res.status(200).json({ status: 'success', data: changed });
  });

  removeMember = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const userId = parseParamId(req, 'userId');
    const team = await Team.findById(id);
    if (!team?.isActive || team.createdBy?.toString() !== req.user!.id) {
      res.status(404).json({ status: 'error', message: 'Team not found' }); return;
    }
    if (team.createdBy?.toString() === userId) {
      res.status(400).json({ status: 'error', message: 'The team owner cannot be removed' }); return;
    }
    if (!team.members.some((member) => member.toString() === userId)) {
      res.status(404).json({ status: 'error', message: 'Member not found in this team' }); return;
    }
    await Team.updateOne({ _id: id }, { $pull: { members: userId } });
    await Project.updateMany({ teamId: team._id, createdBy: { $ne: userId } } as unknown as QueryFilter<IProject>, { $pull: { members: userId } });
    try { await NotificationService.memberRemoved(userId, team.name); }
    catch (error) { console.error('Could not create removal notification', error); }
    await EventService.logEvent('Team member removed', EntityType.TEAM, id, 'A member was removed', req.user!.id);
    res.status(200).json({ status: 'success', data: await Team.findById(id).populate('members', 'userName email') });
  });

}

export const TeamController = new TeamControllerClass();
