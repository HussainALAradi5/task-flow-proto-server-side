import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { IProject } from '../../interface/project/Project';
import { ProjectService } from '../../services/project/ProjectService';
import { catchAsync } from '../../utilities/catchAsync';
import { UserRole } from '../../enums/user/UserRoleEnum';

class ProjectControllerClass extends BaseController<IProject> {
  constructor() {
    super(ProjectService);
  }

  // Trello-like isolation: Fetch ONLY projects belonging to this user
  getMyProjects = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = req.user!;
    
    let filter = {};
    if (user.role !== UserRole.ADMIN) {
      filter = { createdBy: user.id }; 
    }

    const projects = await ProjectService.getAll(filter);
    res.status(200).json({ status: 'success', data: projects });
  });

  // Auto-link project creation to the logged-in user
  createProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectData = { ...req.body, createdBy: req.user!.id };
    const project = await ProjectService.createProject(projectData);
    res.status(201).json({ status: 'success', data: project });
  });
}

export const ProjectController = new ProjectControllerClass();