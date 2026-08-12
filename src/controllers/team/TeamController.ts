import { BaseController } from '../BaseController';
import { ITeam } from '../../interface/team/Team';
import { TeamService } from '../../services/team/TeamService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { buildUserScopeFilter } from '../../utilities/helpers';
import { Request, Response } from 'express';

class TeamControllerClass extends BaseController<ITeam> {
  constructor() {
    super(TeamService);
  }

  createTeam = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const team = await TeamService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: team });
  });

  getMyTeams = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = buildUserScopeFilter(req.user!);
    const pagination = getPaginationParams(req);
    const result = await TeamService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const TeamController = new TeamControllerClass();