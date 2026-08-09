import { IProject } from '../../interface/project/Project';
import { Project } from '../../models/project/Project';
import { BaseService } from '../BaseService';
import { UserService } from '../user/UserService';

class ProjectServiceClass extends BaseService<IProject> {
  constructor() {
    super(Project);
  }

  // Overriding create to handle project creation and ensure creator becomes a Leader
  async createProject(data: Partial<IProject>): Promise<IProject> {
    const project = await this.create(data);

    // If a creator is attached, elevate their role if they are currently just a Member
    if (project.createdBy) {
      await UserService.promoteToLeaderForNewProject(project.createdBy.toString());
    }

    return project;
  }
}

export const ProjectService = new ProjectServiceClass();