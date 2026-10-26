import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../BaseController';
import { IProject } from '../../interface/project/Project';
import { ProjectService } from '../../services/project/ProjectService';
import { catchAsync } from '../../utilities/catchAsync';
import { canAccessOwnedRecord, canReadMemberRecord, buildMemberScopeFilter, parseParamId } from '../../utilities/helpers';
import { Team } from '../../models/team/Team';
import { getPaginationParams } from '../../utilities/pagination';
import { QueryFilter } from 'mongoose';

class ProjectControllerClass extends BaseController<IProject> {
  constructor() {
    super(ProjectService);
  }

  createProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    let members: IProject['members'] = [];
    if (req.body.teamId) {
      const team = await Team.findById(req.body.teamId);
      if (!canAccessOwnedRecord(req.user!, team)) {
        res.status(404).json({ status: 'error', message: 'Team not found' });
        return;
      }
      members = team!.members;
    }
    const project = await ProjectService.createProject({ ...req.body, members, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: project });
  });

  override getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await ProjectService.getAllPaginated(
      buildMemberScopeFilter(req.user!) as QueryFilter<IProject>,
      getPaginationParams(req),
      typeof req.query.search === 'string' ? req.query.search : undefined,
      undefined,
      req.query.exactMatch === 'true',
      req.query.includeInactive === 'true',
    );
    res.status(200).json({ status: 'success', ...result });
  });

  updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.teamId) {
      const team = await Team.findById(req.body.teamId);
      if (!canAccessOwnedRecord(req.user!, team)) {
        res.status(404).json({ status: 'error', message: 'Team not found' });
        return;
      }
    }
    await this.update(req, res, next);
  });

  getBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const project = await ProjectService.getBySlug(parseParamId(req, 'slug'));
    if (!canReadMemberRecord(req.user!, project) || project?.isActive === false) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: project });
  });

}

export const ProjectController = new ProjectControllerClass();
