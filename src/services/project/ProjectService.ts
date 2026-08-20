import { IProject } from '../../interface/project/Project';
import { Project } from '../../models/project/Project';
import { BaseService } from '../BaseService';
import { UserService } from '../user/UserService';
import { EventService } from '../EventService';
import { EntityType } from '../../enums/EntityType';
import { PaginatedResult } from '../../interface/Pagination';
import { PaginationParams } from '../../utilities/pagination';
import { QueryFilter } from 'mongoose';

const PROJECT_POPULATE = {
  path: 'createdBy updatedBy members',
  select: 'userName email',
  model: 'User',
};

class ProjectServiceClass extends BaseService<IProject> {
  constructor() {
    super(Project);
  }

  override async getAllPaginated(
    filter: QueryFilter<IProject> = {},
    params: PaginationParams,
    search?: string,
    searchFields?: string[],
    exactMatch?: boolean,
    includeInactive?: boolean,
  ): Promise<PaginatedResult<IProject>> {
    const result = await super.getAllPaginated(filter, params, search, searchFields, exactMatch, includeInactive);
    const populated = await Project.populate(result.data, PROJECT_POPULATE);
    return { ...result, data: populated };
  }

  async createProject(data: Partial<IProject>): Promise<IProject> {
    const project = await this.create(data);

    if (project.createdBy) {
      await UserService.promoteToLeaderForNewProject(project.createdBy.toString());
    }

    await EventService.logEvent('Project created', EntityType.PROJECT, project.id, `New project: ${project.title}`, data.createdBy?.toString());
    return project;
  }

  async update(id: string, data: Partial<IProject>): Promise<IProject | null> {
    const updated = await super.update(id, data);
    if (updated) {
      await EventService.logEvent('Project updated', EntityType.PROJECT, id, 'Project details updated', id);
    }
    return updated;
  }

  async softDelete(id: string): Promise<IProject | null> {
    const deleted = await super.softDelete(id);
    if (deleted) {
      await EventService.logEvent('Project deactivated', EntityType.PROJECT, id, 'Project was deactivated', id);
    }
    return deleted;
  }
}

export const ProjectService = new ProjectServiceClass();