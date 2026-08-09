import { Request, Response } from 'express';
import { catchAsync } from '../utilities/catchAsync';
import { BaseService } from '../services/BaseService';
import * as mongoose from 'mongoose';
import { UserRole } from '../enums/user/UserRoleEnum';

export class BaseController<T extends mongoose.Document> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  // Automatically injects the authenticated user's ID as the creator
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const payload = {
      ...req.body,
      ...(req.user && { createdBy: req.user.id }),
    };
    const item = await this.service.create(payload);
    res.status(201).json({ status: 'success', data: item });
  });

  // Automatically isolates records based on Trello-like user permissions
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    let filter: Record<string, any> = { ...req.query };

    // If user is not an Admin, strictly scope records to their own user ID
    if (req.user && req.user.role !== UserRole.ADMIN) {
      filter.createdBy = req.user.id;
    }

    const items = await this.service.getAll(filter);
    res.status(200).json({ status: 'success', data: items });
  });

  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await this.service.getById(id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await this.service.update(id, req.body);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: item });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await this.service.softDelete(id);
    if (!item) {
      res.status(404).json({ status: 'error', message: 'Resource not found' });
      return;
    }
    res.status(200).json({ status: 'success', message: 'Resource deactivated successfully' });
  });
}