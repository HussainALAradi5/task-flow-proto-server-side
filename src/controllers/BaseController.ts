import { Request, Response } from 'express';
import { catchAsync } from '../utilities/catchAsync';
import { getPaginationParams } from '../utilities/pagination';
import { parseParamId, buildUserScopeFilter } from '../utilities/helpers';
import { BaseService } from '../services/BaseService';
import * as mongoose from 'mongoose';

export class BaseController<T extends mongoose.Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const payload = {
      ...req.body,
      ...(req.user && { createdBy: req.user.id }),
    };
    const item = await this.service.create(payload);
    res.status(201).json({ status: 'success', data: item });
  });

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = buildUserScopeFilter(req.user!);
    const pagination = getPaginationParams(req);
    const search = (req.query.search as string) || undefined;
    const exactMatch = req.query.exactMatch === 'true';
    const result = await this.service.getAllPaginated(filter, pagination, search, undefined, exactMatch);
    res.status(200).json({ status: 'success', ...result });
  });

  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const item = await this.service.getById(id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const item = await this.service.update(id, req.body);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const item = await this.service.softDelete(id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Resource deactivated successfully' });
  });
}