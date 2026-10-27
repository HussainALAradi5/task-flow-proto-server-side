import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { ITask } from '../../interface/project/Task';
import { TaskService } from '../../services/project/TaskService';
import { catchAsync } from '../../utilities/catchAsync';
import { getPaginationParams } from '../../utilities/pagination';
import { parseParamId, getCurrentUser, canReadMemberRecord } from '../../utilities/helpers';
import { Project } from '../../models/project/Project';
import { Milestone } from '../../models/project/Milestone';
import { taskDateError } from '../../utilities/taskDates';

class TaskControllerClass extends BaseController<ITask> {
  constructor() {
    super(TaskService);
  }

  createTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = getCurrentUser(req);
    const project = await Project.findById(req.body.projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    const createMilestone = req.body.milestoneId ? await Milestone.findById(req.body.milestoneId) : null;
    if (req.body.milestoneId && createMilestone?.projectId.toString() !== project!.id) {
      res.status(400).json({ status: 'error', message: 'Milestone does not belong to this project' });
      return;
    }
    const dateError = taskDateError(req.body, new Date());
    if (dateError) { res.status(400).json({ status: 'error', message: dateError }); return; }
    const task = await TaskService.create({ ...req.body, createdBy: id });
    res.status(201).json({ status: 'success', data: task });
  });

  updateTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const { id: userId } = getCurrentUser(req);
    const data = req.body;
    const existing = await TaskService.getById(id);
    const project = existing && await Project.findById(existing.projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }
    const updateMilestone = data.milestoneId ? await Milestone.findById(data.milestoneId) : null;
    if (data.milestoneId && updateMilestone?.projectId.toString() !== existing!.projectId.toString()) {
      res.status(400).json({ status: 'error', message: 'Milestone does not belong to this project' });
      return;
    }

    if (data.status === 'In Review' || data.status === 'Done') {
      data.lastReviewedBy = userId;
      data.lastReviewedAt = new Date();
    }

    if (data.status === 'Done' && !data.deliveredDate) {
      data.deliveredDate = new Date();
    }

    const dateError = taskDateError({
      startDate: data.startDate !== undefined ? data.startDate : existing!.startDate,
      targetDate: data.targetDate !== undefined ? data.targetDate : existing!.targetDate,
      endDate: data.endDate !== undefined ? data.endDate : existing!.endDate,
      deliveredDate: data.deliveredDate !== undefined ? data.deliveredDate : existing!.deliveredDate,
    }, existing!.createdAt);
    if (dateError) { res.status(400).json({ status: 'error', message: dateError }); return; }

    const task = await TaskService.update(id, data, userId, existing!.status);
    if (!task) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: task });
  });

  deleteTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const existing = await TaskService.getById(id);
    const project = existing && await Project.findById(existing.projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Task not found' });
      return;
    }
    await TaskService.softDelete(id, req.user!.id);
    res.status(200).json({ status: 'success', message: 'Task deactivated successfully' });
  });

  getMyTasksByProject = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = parseParamId(req, 'projectId');
    const project = await Project.findById(projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    const filter = TaskService.buildProjectFilter(projectId);

    const pagination = getPaginationParams(req);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const includeInactive = req.query.includeInactive === 'true';
    const result = await TaskService.getAllPaginated(filter, pagination, search, undefined, undefined, includeInactive);
    res.status(200).json({ status: 'success', ...result });
  });

  getMyTasksByMilestone = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const milestoneId = parseParamId(req, 'milestoneId');
    const milestone = await Milestone.findById(milestoneId);
    const project = milestone && await Project.findById(milestone.projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Milestone not found' });
      return;
    }
    const filter = TaskService.buildMilestoneFilter(milestoneId);

    const pagination = getPaginationParams(req);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const includeInactive = req.query.includeInactive === 'true';
    const result = await TaskService.getAllPaginated(filter, pagination, search, undefined, undefined, includeInactive);
    res.status(200).json({ status: 'success', ...result });
  });
}

export const TaskController = new TaskControllerClass();
