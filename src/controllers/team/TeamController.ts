import { BaseController } from '../BaseController';
import { ITeam } from '../../interface/team/Team';
import { TeamService } from '../../services/team/TeamService';
import { catchAsync } from '../../utilities/catchAsync';
import { Request, Response } from 'express';
import { buildMemberScopeFilter } from '../../utilities/helpers';
import { getPaginationParams } from '../../utilities/pagination';
import { QueryFilter } from 'mongoose';

class TeamControllerClass extends BaseController<ITeam> {
  constructor() {
    super(TeamService);
  }

  createTeam = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const team = await TeamService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: team });
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

}

export const TeamController = new TeamControllerClass();
