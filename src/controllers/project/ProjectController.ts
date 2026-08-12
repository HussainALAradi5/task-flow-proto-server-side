import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IProject } from '../../interface/project/Project';
import { ProjectService } from '../../services/project/ProjectService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { buildUserScopeFilter } from '../../utilities/helpers';

class ProjectControllerClass extends BaseController<IProject> {
  constructor() {
    super(ProjectService);
  }

  createProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const project = await ProjectService.createProject({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: project });
  });

  getMyProjects = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = buildUserScopeFilter(req.user!);
    const pagination = getPaginationParams(req);
    const result = await ProjectService.getAllPaginated(filter, pagination);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const ProjectController = new ProjectControllerClass();