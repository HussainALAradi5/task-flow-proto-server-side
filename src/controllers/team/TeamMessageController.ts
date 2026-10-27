import { Request, Response } from 'express';
import { Team } from '../../models/team/Team';
import { TeamMessage } from '../../models/team/TeamMessage';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId } from '../../utilities/helpers';
import { NotificationService } from '../../services/NotificationService';

async function accessibleTeam(req: Request) {
  const team = await Team.findById(parseParamId(req, 'id'));
  if (!team?.isActive) return null;
  const userId = req.user!.id;
  return team.createdBy?.toString() === userId || team.members.some((member) => member.toString() === userId) ? team : null;
}

export const TeamMessageController = {
  list: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const team = await accessibleTeam(req);
    if (!team) { res.status(404).json({ status: 'error', message: 'Team not found' }); return; }
    const page = getPaginationParams(req);
    const [data, total] = await Promise.all([
      TeamMessage.find({ teamId: team._id }).sort({ createdAt: -1, _id: -1 }).skip(page.skip).limit(page.limit)
        .populate('author', 'userName').exec(),
      TeamMessage.countDocuments({ teamId: team._id }).exec(),
    ]);
    res.status(200).json({ status: 'success', data, pagination: { page: page.page, limit: page.limit, total, totalPages: Math.ceil(total / page.limit) } });
  }),

  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const team = await accessibleTeam(req);
    if (!team) { res.status(404).json({ status: 'error', message: 'Team not found' }); return; }
    const message = await TeamMessage.create({ teamId: team._id, author: req.user!.id, content: req.body.content.trim(), attachment: req.body.attachment });
    await message.populate('author', 'userName');
    try { await NotificationService.teamMessage(team.id, team.name, team.createdBy, team.members, req.user!.id); }
    catch (error) { console.error('Could not create message notifications', error); }
    res.status(201).json({ status: 'success', data: message });
  }),
};
