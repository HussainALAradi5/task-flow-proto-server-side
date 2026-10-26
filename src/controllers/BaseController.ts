import { Request, Response } from 'express';
import { catchAsync } from '../utilities/catchAsync';
import { getPaginationParams } from '../utilities/pagination';
import { parseParamId, buildUserScopeFilter, canAccessOwnedRecord, canReadMemberRecord } from '../utilities/helpers';
import { BaseService } from '../services/BaseService';
import * as mongoose from 'mongoose';

export class BaseController<T extends mongoose.Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filter = buildUserScopeFilter(req.user!);
    const pagination = getPaginationParams(req);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const exactMatch = req.query.exactMatch === 'true';
    const includeInactive = req.query.includeInactive === 'true';
    const result = await this.service.getAllPaginated(filter, pagination, search, undefined, exactMatch, includeInactive);
    res.status(200).json({ status: 'success', ...result });
  });

  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const item = await this.service.getById(id);
    if (!canReadMemberRecord(req.user!, item)) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const existing = await this.service.getById(id);
    if (!canAccessOwnedRecord(req.user!, existing)) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    const item = await this.service.update(id, req.body, req.user!.id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = parseParamId(req, 'id');
    const existing = await this.service.getById(id);
    if (!canAccessOwnedRecord(req.user!, existing)) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    const item = await this.service.softDelete(id, req.user!.id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Resource deactivated successfully' });
  });
}
