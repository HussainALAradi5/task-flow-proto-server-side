import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IProject } from '../../interface/project/Project';
import { ProjectService } from '../../services/project/ProjectService';
import { catchAsync } from '../../utilities/catchAsync';

class ProjectControllerClass extends BaseController<IProject> {
  constructor() {
    super(ProjectService);
  }

  createProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const project = await ProjectService.createProject(req.body);
    res.status(201).json({ status: 'success', data: project });
  });
}

export const ProjectController = new ProjectControllerClass();