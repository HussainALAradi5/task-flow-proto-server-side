import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IProject } from '../../interface/project/Project';
import { ProjectService } from '../../services/project/ProjectService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { buildUserScopeFilter } from '../../utilities/helpers';
import { parseParamId } from '../../utilities/helpers';
import { UserRole } from '../../enums/user/UserRole';

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

  getBySlug = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const slug = parseParamId(req, 'slug');
    const project = await ProjectService.getBySlug(slug);
    if (!project) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    if (
      req.user!.role !== UserRole.ADMIN &&
      project.createdBy?.toString() !== req.user!.id
    ) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: project });
  });
}

export const ProjectController = new ProjectControllerClass();
