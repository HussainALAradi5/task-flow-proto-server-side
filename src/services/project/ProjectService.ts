import { IProject } from '../../interface/project/Project';
import { Project } from '../../models/project/Project';
import { BaseService } from '../BaseService';

class ProjectServiceClass extends BaseService<IProject> {
  constructor() {
    super(Project);
  }
}
export const ProjectService = new ProjectServiceClass();