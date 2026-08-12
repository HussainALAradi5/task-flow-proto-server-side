import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IMilestone } from '../../interface/project/Milestone';
import { MilestoneService } from '../../services/project/MilestoneService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId } from '../../utilities/helpers';
import { UserRole } from '../../enums/user/UserRole';

class MilestoneControllerClass extends BaseController<IMilestone> {
  constructor() {
    super(MilestoneService);
  }

  createMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const milestone = await MilestoneService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: milestone });
  });

  getMyMilestones = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = parseParamId(req, 'projectId');
    const isAdmin = req.user!.role === UserRole.ADMIN;
    const filter = isAdmin
      ? MilestoneService.buildProjectFilter(projectId)
      : MilestoneService.buildProjectUserFilter(projectId, req.user!.id);

    const pagination = getPaginationParams(req);
    const result = await MilestoneService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const MilestoneController = new MilestoneControllerClass();