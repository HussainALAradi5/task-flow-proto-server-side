import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IMilestone } from '../../interface/project/Milestone';
import { MilestoneService } from '../../services/project/MilestoneService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId } from '../../utilities/helpers';
import { Project } from '../../models/project/Project';
import { canAccessOwnedRecord, canReadMemberRecord } from '../../utilities/helpers';

class MilestoneControllerClass extends BaseController<IMilestone> {
  constructor() {
    super(MilestoneService);
  }

  createMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const project = await Project.findById(req.body.projectId);
    if (!canAccessOwnedRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    const milestone = await MilestoneService.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: milestone });
  });

  getMyMilestones = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = parseParamId(req, 'projectId');
    const project = await Project.findById(projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    const filter = MilestoneService.buildProjectFilter(projectId);

    const pagination = getPaginationParams(req);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const result = await MilestoneService.getAllPaginated(filter, pagination, search);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const MilestoneController = new MilestoneControllerClass();
