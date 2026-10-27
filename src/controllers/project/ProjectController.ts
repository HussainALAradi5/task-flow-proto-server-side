import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../BaseController';
import { IProject } from '../../interface/project/Project';
import { ProjectService } from '../../services/project/ProjectService';
import { catchAsync } from '../../utilities/catchAsync';
import { canAccessOwnedRecord, canReadMemberRecord, buildMemberScopeFilter, parseParamId } from '../../utilities/helpers';
import { Team } from '../../models/team/Team';
import { getPaginationParams } from '../../utilities/pagination';
import { QueryFilter, Types } from 'mongoose';
import { ProjectScope } from '../../enums/ProjectScope';

class ProjectControllerClass extends BaseController<IProject> {
  constructor() {
    super(ProjectService);
  }

  createProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    let members: IProject['members'] = [];
    if (req.body.teamId) {
      const team = await Team.findById(req.body.teamId);
      if (!team?.isActive || (team.createdBy?.toString() !== req.user!.id && !team.members.some((member) => member.toString() === req.user!.id))) {
        res.status(404).json({ status: 'error', message: 'Team not found' });
        return;
      }
      members = [...new Set([...team.members, team.createdBy].filter(Boolean).map((id) => id!.toString()))]
        .filter((id) => id !== req.user!.id).map((id) => new Types.ObjectId(id)) as unknown as IProject['members'];
    }
    const project = await ProjectService.createProject({ ...req.body, members, createdBy: req.user!.id });
    res.status(201).json({ status: 'success', data: project });
  });

  override getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const scope = typeof req.query.scope === 'string' ? req.query.scope : ProjectScope.All;
    if (!Object.values(ProjectScope).includes(scope as ProjectScope)) {
      res.status(400).json({ status: 'error', message: 'Invalid project scope' }); return;
    }
    const teamId = typeof req.query.teamId === 'string' ? req.query.teamId : undefined;
    if (teamId && !Types.ObjectId.isValid(teamId)) {
      res.status(400).json({ status: 'error', message: 'Invalid teamId' }); return;
    }
    const access = buildMemberScopeFilter(req.user!);
    const filters: Record<string, unknown>[] = [access];
    if (scope === ProjectScope.My) filters.push({ createdBy: new Types.ObjectId(req.user!.id) });
    if (scope === ProjectScope.Team) filters.push({ teamId: { $ne: null } });
    if (teamId) filters.push({ teamId: new Types.ObjectId(teamId) });
    const result = await ProjectService.getAllPaginated(
      { $and: filters } as unknown as QueryFilter<IProject>,
      getPaginationParams(req),
      typeof req.query.search === 'string' ? req.query.search : undefined,
      undefined,
      req.query.exactMatch === 'true',
      req.query.includeInactive === 'true',
    );
    res.status(200).json({ status: 'success', ...result });
  });

  updateProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.body.teamId !== undefined) {
      const team = req.body.teamId ? await Team.findById(req.body.teamId) : null;
      if (req.body.teamId && (!team?.isActive || (team.createdBy?.toString() !== req.user!.id && !team.members.some((member) => member.toString() === req.user!.id)))) {
        res.status(404).json({ status: 'error', message: 'Team not found' });
        return;
      }
      req.body.members = team ? [...new Set([...team.members, team.createdBy].filter(Boolean).map((id) => id!.toString()))]
        .filter((id) => id !== req.user!.id).map((id) => new Types.ObjectId(id)) : [];
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
