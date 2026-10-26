import { BaseController } from './BaseController';
import { EventService } from '../services/EventService';
import { IEvent } from '../interface/Event';
import { Request, Response } from 'express';
import { Project } from '../models/project/Project';
import { catchAsync } from '../utilities/catchAsync';
import { canReadMemberRecord, parseParamId } from '../utilities/helpers';
import { getPaginationParams } from '../utilities/pagination';
import { Types } from 'mongoose';

class EventControllerClass extends BaseController<IEvent> {
  constructor() {
    super(EventService);
  }

  getProjectHistory = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const projectId = parseParamId(req, 'projectId');
    if (!Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ status: 'error', message: 'Invalid project ID' });
      return;
    }
    const project = await Project.findById(projectId);
    if (!canReadMemberRecord(req.user!, project)) {
      res.status(404).json({ status: 'error', message: 'Project not found' });
      return;
    }
    const result = await EventService.getProjectHistory(projectId, getPaginationParams(req));
    res.status(200).json({ status: 'success', ...result });
  });
}

export const EventController = new EventControllerClass();
