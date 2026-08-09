import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { ITeam } from '../../interface/team/Team';
import { TeamService } from '../../services/team/TeamService';
import { catchAsync } from '../../utilities/catchAsync';
import { UserRole } from '../../enums/user/UserRoleEnum';

class TeamControllerClass extends BaseController<ITeam> {
  constructor() {
    super(TeamService);
  }

  // Auto-link team creation to the logged-in user
  createTeam = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const teamData = { ...req.body, createdBy: req.user!.id };
    const team = await TeamService.create(teamData);
    res.status(201).json({ status: 'success', data: team });
  });

  // Trello-like isolation: Fetch ONLY teams this user manages/belongs to
  getMyTeams = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    
    let filter = {};
    if (user.role !== UserRole.ADMIN) {
      filter = { createdBy: user.id }; 
    }

    const teams = await TeamService.getAll(filter);
    res.status(200).json({ status: 'success', data: teams });
  });
}

export const TeamController = new TeamControllerClass();